"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const db_js_1 = __importDefault(require("../config/db.js"));
class AnalyticsService {
    static async getDashboardData(userId) {
        // 1. Fetch User's ATS Reports
        const atsReports = await db_js_1.default.atsReport.findMany({
            where: { resume: { userId } },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        const totalAts = atsReports.length;
        const latestAtsScore = totalAts > 0 ? (atsReports[0].matchPercentage || 0) : 0;
        const avgAtsScore = totalAts > 0
            ? atsReports.reduce((sum, r) => sum + (r.matchPercentage || 0), 0) / totalAts
            : 0;
        // 2. Fetch User's Mock Interviews
        const interviews = await db_js_1.default.interview.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        const completedInterviews = interviews.filter(i => i.status === 'COMPLETED');
        const totalInterviews = completedInterviews.length;
        const avgInterviewScore = totalInterviews > 0
            ? completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / totalInterviews
            : 0;
        // Aggregate strengths & weaknesses from interviews
        const strengthsCount = {};
        const weaknessesCount = {};
        completedInterviews.forEach(i => {
            i.strengths?.forEach(s => { strengthsCount[s] = (strengthsCount[s] || 0) + 1; });
            i.weaknesses?.forEach(w => { weaknessesCount[w] = (weaknessesCount[w] || 0) + 1; });
        });
        const topStrengths = Object.keys(strengthsCount).sort((a, b) => strengthsCount[b] - strengthsCount[a]).slice(0, 3);
        const topWeaknesses = Object.keys(weaknessesCount).sort((a, b) => weaknessesCount[b] - weaknessesCount[a]).slice(0, 3);
        // 3. Fetch User's Coding Submissions
        const codingSubmissions = await db_js_1.default.codingSubmission.findMany({
            where: { userId },
            include: { problem: true, feedbacks: true },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        const totalCoding = codingSubmissions.length;
        const acceptedCoding = codingSubmissions.filter(c => c.status === 'ACCEPTED').length;
        const codingSuccessRate = totalCoding > 0 ? (acceptedCoding / totalCoding) * 100 : 0;
        let totalReadability = 0;
        let readabilityCount = 0;
        codingSubmissions.forEach(sub => {
            sub.feedbacks?.forEach(f => {
                if (f.readabilityScore) {
                    totalReadability += f.readabilityScore;
                    readabilityCount++;
                }
            });
        });
        const avgCodeReadability = readabilityCount > 0 ? (totalReadability / readabilityCount) : 0;
        // Calculated Coding Rating Score
        const calculatedCodingScore = totalCoding > 0
            ? Math.min(1200, 100 + (acceptedCoding * 40) + (totalCoding * 10) + Math.round(avgCodeReadability))
            : 0;
        // Realistic XP & Candidate Level Calculation
        // Accepted Coding = 40 XP, Completed Interview = 50 XP, ATS Scan = 25 XP
        const xpPoints = (acceptedCoding * 40) + (totalInterviews * 50) + (totalAts * 25);
        let candidateLevel = 1;
        if (xpPoints > 1500)
            candidateLevel = 6;
        else if (xpPoints > 1000)
            candidateLevel = 5;
        else if (xpPoints > 600)
            candidateLevel = 4;
        else if (xpPoints > 300)
            candidateLevel = 3;
        else if (xpPoints > 100)
            candidateLevel = 2;
        else
            candidateLevel = 1;
        // Calculate Practice Streak (distinct calendar dates with user activity)
        const activeDates = new Set();
        [...atsReports, ...interviews, ...codingSubmissions].forEach(item => {
            if (item.createdAt) {
                activeDates.add(new Date(item.createdAt).toISOString().split('T')[0]);
            }
        });
        const streakDays = activeDates.size > 0 ? activeDates.size : 0;
        // 4. Build Recent Assessment History (Combining user's real DB records)
        const recentHistory = [];
        interviews.forEach(i => {
            recentHistory.push({
                id: i.id,
                type: 'INTERVIEW',
                title: `${i.company || 'Practice'} Mock Assessment`,
                subtitle: `${i.role || 'Software Engineer'} — ${i.type} Round`,
                scoreBadge: i.score ? `${Math.round(i.score)}/100` : 'In Progress',
                badgeStyle: (i.score || 0) >= 80 ? 'emerald' : (i.score || 0) >= 60 ? 'violet' : 'amber',
                createdAt: new Date(i.createdAt).toISOString()
            });
        });
        atsReports.forEach(r => {
            const matchScore = Math.round(r.matchPercentage || 0);
            recentHistory.push({
                id: r.id,
                type: 'ATS',
                title: 'ATS Resume Scanner',
                subtitle: r.jobDescription ? (r.jobDescription.slice(0, 40) + '...') : 'Job Description Analysis',
                scoreBadge: `${matchScore}% Match`,
                badgeStyle: matchScore >= 75 ? 'emerald' : matchScore >= 50 ? 'violet' : 'amber',
                createdAt: new Date(r.createdAt).toISOString()
            });
        });
        codingSubmissions.forEach(c => {
            recentHistory.push({
                id: c.id,
                type: 'CODING',
                title: `Coding: ${c.problem?.title || 'Algorithm Challenge'}`,
                subtitle: `${c.language.toUpperCase()} Submission`,
                scoreBadge: c.status === 'ACCEPTED' ? 'Accepted' : 'Wrong Answer',
                badgeStyle: c.status === 'ACCEPTED' ? 'emerald' : 'rose',
                createdAt: new Date(c.createdAt).toISOString()
            });
        });
        // Sort combined history descending by date
        recentHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const topRecentHistory = recentHistory.slice(0, 6);
        // 5. Build Dynamic Weekly Progress Trajectory (Mon - Sun)
        // Map ONLY actual activity per day of week (0 if no activity on that day)
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const progressData = daysOfWeek.map((dayName, idx) => {
            const targetDay = (idx + 1) % 7; // Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=0
            const dayItems = recentHistory.filter(h => new Date(h.createdAt).getDay() === targetDay);
            let dayScore = 0;
            if (dayItems.length > 0) {
                let totalDayScore = 0;
                dayItems.forEach(item => {
                    const numericMatch = item.scoreBadge.match(/\d+/);
                    if (numericMatch) {
                        totalDayScore += parseInt(numericMatch[0], 10);
                    }
                    else if (item.scoreBadge === 'Accepted') {
                        totalDayScore += 90;
                    }
                    else {
                        totalDayScore += 50;
                    }
                });
                dayScore = Math.round(totalDayScore / dayItems.length);
            }
            else {
                // No activity performed on this day
                dayScore = 0;
            }
            return { name: dayName, score: dayScore };
        });
        // 6. Overall Readiness Score (Weighted: Interviews 40%, ATS 30%, Coding 30%)
        let readinessScore = 0;
        if (totalInterviews > 0 || totalAts > 0 || totalCoding > 0) {
            const wInt = totalInterviews > 0 ? avgInterviewScore * 0.4 : 0;
            const wAts = totalAts > 0 ? avgAtsScore * 0.3 : 0;
            const wCod = totalCoding > 0 ? codingSuccessRate * 0.3 : 0;
            let totalWeight = 0;
            if (totalInterviews > 0)
                totalWeight += 0.4;
            if (totalAts > 0)
                totalWeight += 0.3;
            if (totalCoding > 0)
                totalWeight += 0.3;
            readinessScore = totalWeight > 0 ? Math.round((wInt + wAts + wCod) / totalWeight) : 0;
        }
        else {
            readinessScore = 0;
        }
        return {
            readinessScore,
            progressData,
            stats: {
                atsScore: totalAts > 0 ? Math.round(latestAtsScore) : 0,
                atsChangeText: totalAts > 1 ? `${totalAts} total scans` : totalAts === 1 ? 'First scan completed' : 'No scans yet',
                codingScore: calculatedCodingScore,
                codingChangeText: acceptedCoding > 0 ? `${acceptedCoding} accepted solutions` : 'No accepted submissions yet',
                interviewScore: totalInterviews > 0 ? Math.round(avgInterviewScore) : 0,
                interviewChangeText: totalInterviews > 0 ? `${totalInterviews} rounds completed` : 'No rounds completed yet',
                streakDays,
                xpPoints,
                candidateLevel,
            },
            recentHistory: topRecentHistory,
            modules: {
                ats: { total: totalAts, avgScore: Math.round(avgAtsScore) },
                interviews: { total: totalInterviews, avgScore: Math.round(avgInterviewScore), topStrengths, topWeaknesses },
                coding: { total: totalCoding, successRate: Math.round(codingSuccessRate), avgReadability: Math.round(avgCodeReadability) }
            }
        };
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map