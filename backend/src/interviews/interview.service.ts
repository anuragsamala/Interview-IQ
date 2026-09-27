import prisma from '../config/db.js';
import { GeminiService } from '../ai/gemini.service.js';
import { InterviewType } from '@prisma/client';

export class InterviewService {
  static async startInterview(userId: string, type: string, company: string, role: string, difficulty: string) {
    const interview = await prisma.interview.create({
      data: {
        userId,
        type: type as InterviewType,
        company,
        role,
        difficulty,
        status: 'IN_PROGRESS',
      }
    });

    // Generate first question
    const questionText = await GeminiService.generateInterviewQuestion(
      type, role, company, difficulty, []
    );

    const question = await prisma.interviewQuestion.create({
      data: {
        interviewId: interview.id,
        questionText,
        order: 1
      }
    });

    return { interview, question };
  }

  static async submitAnswer(interviewId: string, questionId: string, answerText: string) {
    // Save the answer
    await prisma.interviewAnswer.create({
      data: {
        questionId,
        answerText,
        transcript: answerText, // for text-based, transcript is the answer
        speechDuration: 0,
        fillerWordCount: 0,
        speakingSpeed: 0,
        grammarScore: 0,
        communicationScore: 0,
        relevanceScore: 0
      }
    });

    // Fetch the interview to get context for next question
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        questions: {
          include: { answer: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!interview) throw new Error("Interview not found");

    // Build conversation history
    const history: { role: string; text: string }[] = [];
    for (const q of interview.questions) {
      history.push({ role: 'interviewer', text: q.questionText });
      if (q.answer) {
        history.push({ role: 'candidate', text: q.answer.answerText });
      }
    }

    // Check if we hit a limit (e.g., 5 questions for mock)
    if (interview.questions.length >= 5) {
      return { completed: true };
    }

    // Generate next question
    const nextQuestionText = await GeminiService.generateInterviewQuestion(
      interview.type,
      interview.role || 'General',
      interview.company || 'Tech',
      interview.difficulty,
      history
    );

    const nextQuestion = await prisma.interviewQuestion.create({
      data: {
        interviewId: interview.id,
        questionText: nextQuestionText,
        order: interview.questions.length + 1
      }
    });

    return { completed: false, nextQuestion };
  }

  static async completeInterview(interviewId: string) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        questions: {
          include: { answer: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!interview) throw new Error("Interview not found");

    // Build full transcript
    let transcriptText = '';
    for (const q of interview.questions) {
      transcriptText += `Interviewer: ${q.questionText}\n`;
      if (q.answer) {
        transcriptText += `Candidate: ${q.answer.answerText}\n\n`;
      }
    }

    // Generate feedback
    const feedbackData = await GeminiService.generateInterviewFeedback(
      interview.type,
      interview.role || 'General',
      interview.difficulty,
      transcriptText
    );

    // Save Transcript
    await prisma.interviewTranscript.create({
      data: {
        interviewId,
        fullText: transcriptText
      }
    });

    // Save Feedback
    await prisma.interviewFeedback.create({
      data: {
        interviewId,
        generalFeedback: feedbackData.generalFeedback,
        technicalFeedback: feedbackData.technicalFeedback,
        communicationFeedback: feedbackData.communicationFeedback
      }
    });

    // Update Interview status
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'COMPLETED',
        score: feedbackData.score,
        overallRating: feedbackData.overallRating,
        hiringRecommendation: feedbackData.hiringRecommendation,
        strengths: feedbackData.strengths,
        weaknesses: feedbackData.weaknesses
      }
    });

    return updatedInterview;
  }
}
