import { Schema, model } from 'mongoose';

const ORDER_STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

const orderSchema = new Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
            index: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        fullAddress: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ORDER_STATUSES,
            default: 'pending',
            index: true
        },
        priority: {
            type: Number,
            min: 1,
            max: 5,
            default: 5
        },
        completedAt: Date
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        collection: 'Orders'
    }
);

export default model('Order', orderSchema);