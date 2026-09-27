"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const db_js_1 = __importDefault(require("../config/db.js"));
class AdminService {
    static async getSystemOverview() {
        // Aggregate platform-wide stats
        const [totalUsers, totalResumes, totalAtsReports, totalInterviews, totalCodingSubmissions] = await Promise.all([
            db_js_1.default.user.count(),
            db_js_1.default.resume.count(),
            db_js_1.default.atsReport.count(),
            db_js_1.default.interview.count(),
            db_js_1.default.codingSubmission.count()
        ]);
        // Recent signups (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentSignups = await db_js_1.default.user.count({
            where: { createdAt: { gte: weekAgo } }
        });
        // Top users by interview count
        const topUsers = await db_js_1.default.user.findMany({
            include: {
                _count: {
                    select: {
                        interviews: true,
                        codingSubmissions: true,
                        resumes: true
                    }
                }
            },
            orderBy: { interviews: { _count: 'desc' } },
            take: 10
        });
        // Completed interviews stats
        const completedInterviews = await db_js_1.default.interview.count({
            where: { status: 'COMPLETED' }
        });
        const avgInterviewScore = await db_js_1.default.interview.aggregate({
            _avg: { score: true },
            where: { status: 'COMPLETED' }
        });
        // Accepted coding submissions
        const acceptedSubmissions = await db_js_1.default.codingSubmission.count({
            where: { status: 'ACCEPTED' }
        });
        return {
            stats: {
                totalUsers,
                recentSignups,
                totalResumes,
                totalAtsReports,
                totalInterviews,
                completedInterviews,
                avgInterviewScore: Math.round(avgInterviewScore._avg.score || 0),
                totalCodingSubmissions,
                acceptedSubmissions
            },
            topUsers: topUsers.map(u => ({
                id: u.id,
                email: u.email,
                name: u.email,
                role: u.role,
                createdAt: u.createdAt,
                interviews: u._count.interviews,
                submissions: u._count.codingSubmissions,
                resumes: u._count.resumes
            }))
        };
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map