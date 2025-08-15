import express from 'express';
import Job from '../models/Job.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { title, company, address, location, status, notes } = req.body;

    try {
        const allowedStatuses = ['applied', 'interviewing', 'accepted', 'rejected', 'none', 'withdrawn'];
        const allowedLocations = ['remote', 'onsite', 'hybrid', 'none'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid job status' });
        }

        if (!allowedLocations.includes(location)) {
            return res.status(400).json({ message: 'Invalid job location' });
        }

        if (!title || !company || !address) {
            return res.status(400).json({ message: 'Title, company, and address are required' });
        }

        const newJob = new Job({
            title,
            company,
            address,
            location,
            status,
            notes,
            user: req.user
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.user });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { title, company, address, location, status, notes } = req.body;

    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.user });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const allowedStatuses = ['applied', 'interviewing', 'accepted', 'rejected', 'none', 'withdrawn'];
        const allowedLocations = ['remote', 'onsite', 'hybrid', 'none'];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid job status' });
        }

        if (location && !allowedLocations.includes(location)) {
            return res.status(400).json({ message: 'Invalid job location' });
        }

        if ('title' in req.body && !title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        if ('company' in req.body && !company) {
            return res.status(400).json({ message: 'Company is required' });
        }

        if ('address' in req.body && !address) {
            return res.status(400).json({ message: 'Address is required' });
        }

        if (title) job.title = title;
        if (company) job.company = company;
        if (address) job.address = address;
        if (location) job.location = location;
        if (status) job.status = status;
        if (notes) job.notes = notes;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, user: req.user });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;