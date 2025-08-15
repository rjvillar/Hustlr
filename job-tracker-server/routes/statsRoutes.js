import express from 'express';
import Job from '../models/Job.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        console.log('Fetching stats for user ID:', userId);

        const allJobs = await Job.find({ user: userId });
        console.log('Found jobs:', allJobs.length);

        const recentApps = await Job.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(4);

        console.log('Recent applications found:', recentApps.length);

        const stats = {
            totalApplications: allJobs.length,
            interviews: allJobs.filter(job => job.status === 'interviewing').length,
            pending: allJobs.filter(job => job.status === 'applied').length,
            rejections: allJobs.filter(job => job.status === 'rejected').length,
            offers: allJobs.filter(job => job.status === 'offer received').length,
            withdrawn: allJobs.filter(job => job.status === 'withdrawn').length,

            statusBreakdown: {
                applied: allJobs.filter(job => job.status === 'applied').length,
                interviewing: allJobs.filter(job => job.status === 'interviewing').length,
                'offer received': allJobs.filter(job => job.status === 'offer received').length,
                rejected: allJobs.filter(job => job.status === 'rejected').length,
                withdrawn: allJobs.filter(job => job.status === 'withdrawn').length,
            },

            locationBreakdown: {
                remote: allJobs.filter(job => job.location === 'remote').length,
                hybrid: allJobs.filter(job => job.location === 'hybrid').length,
                onsite: allJobs.filter(job => job.location === 'onsite').length,
            },

            recentApplications: recentApps.map(job => ({
                id: job._id,
                title: job.title,
                company: job.company,
                location: job.address,
                date: job.createdAt,
                status: job.status
            }))
        };

        console.log('Calculated stats with recent apps:', stats.recentApplications.length);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ message: 'Server error while fetching statistics' });
    }
});

export default router;