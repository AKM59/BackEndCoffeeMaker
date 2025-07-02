// -- Libraries --
import { Schema, model, Types } from 'mongoose';

const batchSchema = new Schema({
    batchId: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        index: true,
    },
    pieces: {
        type: Number,
        required: true,
        min: 1,
    },
    productionSite: {
        type: String,
        required: true,
        trim: true,
    },
    orderId: {
        type: Types.ObjectId,
        ref: 'order',
        required: true,
    },
    status: {
        type: String,
        enum: ['planning', 'in_production', 'completed'],
        default: 'planning',
    },
    currentStation: {
        type: String,
        enum: ['cnc', 'lathe', 'assembly', 'test'],
        default: 'cnc'
    },
    completedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    collection: 'Batches',
});

export default model('batch', batchSchema);