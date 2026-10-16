"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodingService = void 0;
const db_js_1 = __importDefault(require("../config/db.js"));
const gemini_service_js_1 = require("../ai/gemini.service.js");
const striver_sheet_data_js_1 = require("./striver-sheet-data.js");
const company_tags_js_1 = require("./company-tags.js");
const code_executor_js_1 = require("./code-executor.js");
class CodingService {
    static async getProblems() {
        let existingProblems = await db_js_1.default.codingProblem.findMany({
            orderBy: { createdAt: 'asc' }
        });
        // Automatically seed all Striver Sheet problems if database has fewer
        if (existingProblems.length < striver_sheet_data_js_1.STRIVER_PROBLEMS.length) {
            for (const p of striver_sheet_data_js_1.STRIVER_PROBLEMS) {
                const alreadyExists = existingProblems.some(ep => ep.title.trim().toLowerCase() === p.title.trim().toLowerCase());
                if (!alreadyExists) {
                    const companies = p.companies || (0, company_tags_js_1.getCompaniesForTitle)(p.title);
                    const created = await db_js_1.default.codingProblem.create({
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
                const companies = (0, company_tags_js_1.getCompaniesForTitle)(prob.title);
                await db_js_1.default.codingProblem.update({
                    where: { id: prob.id },
                    data: { companies }
                });
                prob.companies = companies;
            }
        }
        return existingProblems;
    }
    static async submitCode(userId, problemId, code, language) {
        const problem = await db_js_1.default.codingProblem.findUnique({ where: { id: problemId } });
        if (!problem)
            throw new Error("Problem not found");
        // 1. Gather all test cases (from database + sample input/output)
        const testCases = [];
        if (Array.isArray(problem.testCases)) {
            testCases.push(...problem.testCases);
        }
        if (problem.sampleInput && problem.sampleOutput) {
            const alreadyHasSample = testCases.some(tc => tc.input === problem.sampleInput);
            if (!alreadyHasSample) {
                testCases.unshift({ input: problem.sampleInput, expected: problem.sampleOutput });
            }
        }
        // 2. Real Sandboxed Execution
        const execution = code_executor_js_1.CodeExecutor.executeJs(code, testCases.length > 0 ? testCases : [
            { input: problem.sampleInput || '', expected: problem.sampleOutput || '' }
        ]);
        const status = execution.status;
        const runtime = execution.runtime;
        const memory = execution.memory;
        // 3. Evaluate Code Quality & Complexity
        const evaluation = await gemini_service_js_1.GeminiService.evaluateCodeQuality(problem.description, code, language, execution);
        // 4. Save Submission
        const submission = await db_js_1.default.codingSubmission.create({
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
        const feedback = await db_js_1.default.codingFeedback.create({
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
    static async getHistory(userId) {
        return await db_js_1.default.codingSubmission.findMany({
            where: { userId },
            include: { problem: true, feedbacks: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}
exports.CodingService = CodingService;
//# sourceMappingURL=coding.service.js.map