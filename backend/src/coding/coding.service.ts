import prisma from '../config/db.js';
import { GeminiService } from '../ai/gemini.service.js';
import { STRIVER_PROBLEMS } from './striver-sheet-data.js';
import { getCompaniesForTitle } from './company-tags.js';

import { CodeExecutor } from './code-executor.js';

export class CodingService {
  static async getProblems() {
    let existingProblems = await prisma.codingProblem.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // Automatically seed all Striver Sheet problems if database has fewer
    if (existingProblems.length < STRIVER_PROBLEMS.length) {
      for (const p of STRIVER_PROBLEMS) {
        const alreadyExists = existingProblems.some(
          ep => ep.title.trim().toLowerCase() === p.title.trim().toLowerCase()
        );
        if (!alreadyExists) {
          const companies = p.companies || getCompaniesForTitle(p.title);
          const created = await prisma.codingProblem.create({ 
            data: { ...p, companies } 
          });
          existingProblems.push(created);
        }
      }
    }

    // Ensure any problem in database without companies gets updated
    const problemsWithoutCompanies = existingProblems.filter(p => !p.companies || p.companies.length === 0);
    if (problemsWithoutCompanies.length > 0) {
      for (const prob of problemsWithoutCompanies) {
        const companies = getCompaniesForTitle(prob.title);
        await prisma.codingProblem.update({
          where: { id: prob.id },
          data: { companies }
        });
        prob.companies = companies;
      }
    }

    return existingProblems;
  }

  static async submitCode(userId: string, problemId: string, code: string, language: string) {
    const problem = await prisma.codingProblem.findUnique({ where: { id: problemId } });
    if (!problem) throw new Error("Problem not found");

    // 1. Gather all test cases (from database + sample input/output)
    const testCases: Array<{ input: string; expected: string }> = [];
    if (Array.isArray(problem.testCases)) {
      testCases.push(...(problem.testCases as any[]));
    }
    if (problem.sampleInput && problem.sampleOutput) {
      const alreadyHasSample = testCases.some(tc => tc.input === problem.sampleInput);
      if (!alreadyHasSample) {
        testCases.unshift({ input: problem.sampleInput, expected: problem.sampleOutput });
      }
    }

    // 2. Real Sandboxed Execution
    const execution = CodeExecutor.executeJs(code, testCases.length > 0 ? testCases : [
      { input: problem.sampleInput || '', expected: problem.sampleOutput || '' }
    ]);

    const status = execution.status;
    const runtime = execution.runtime;
    const memory = execution.memory;

    // 3. Evaluate Code Quality & Complexity
    const evaluation = await GeminiService.evaluateCodeQuality(
      problem.description,
      code,
      language,
      execution
    );

    // 4. Save Submission
    const submission = await prisma.codingSubmission.create({
      data: {
        userId,
        problemId,
        code,
        language,
        status,
        runtime,
        memory
      }
    });

    // 5. Save Feedback
    const feedback = await prisma.codingFeedback.create({
      data: {
        submissionId: submission.id,
        readabilityScore: evaluation.readabilityScore,
        complexityAnalysis: evaluation.complexityAnalysis,
        edgeCasesMissed: evaluation.edgeCasesMissed,
        feedbackText: evaluation.feedbackText
      }
    });

    return {
      submission,
      feedback,
      testResults: execution.testResults,
      errorMessage: execution.errorMessage
    };
  }

  static async getHistory(userId: string) {
    return await prisma.codingSubmission.findMany({
      where: { userId },
      include: { problem: true, feedbacks: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
