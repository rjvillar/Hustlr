import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid', 'none'],
        default: 'none'
    },
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'accepted', 'rejected', 'none', 'withdrawn'],
        default: 'applied'
    },
    notes: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateApplied: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('Job', jobSchema);