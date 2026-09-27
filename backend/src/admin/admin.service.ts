import prisma from '../config/db.js';

export class AdminService {
  static async getSystemOverview() {
    // Aggregate platform-wide stats
    const [
      totalUsers,
      totalResumes,
      totalAtsReports,
      totalInterviews,
      totalCodingSubmissions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.resume.count(),
      prisma.atsReport.count(),
      prisma.interview.count(),
      prisma.codingSubmission.count()
    ]);

    // Recent signups (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSignups = await prisma.user.count({
      where: { createdAt: { gte: weekAgo } }
    });

    // Top users by interview count
    const topUsers = await prisma.user.findMany({
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
    const completedInterviews = await prisma.interview.count({
      where: { status: 'COMPLETED' }
    });
    const avgInterviewScore = await prisma.interview.aggregate({
      _avg: { score: true },
      where: { status: 'COMPLETED' }
    });

    // Accepted coding submissions
    const acceptedSubmissions = await prisma.codingSubmission.count({
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
