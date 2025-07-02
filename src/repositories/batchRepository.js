// -- Functions -- \\ 
import Batch from "../models/Batch.js";


const findAll = async ({ page = 1, limit = 10 }) => {
    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (validatedPage - 1) * validatedLimit;

    const [results, total] = await Promise.all([
        Batch.find().skip(skip).limit(validatedLimit).sort({ createdAt: -1 }).lean(),
        Batch.countDocuments()
    ]);

    return { page: validatedPage, limit: validatedLimit, totalPages: Math.ceil(total / validatedLimit), totalResults: total, results };
};

const findById = async (batchId, options = {}) => {
    return await Batch.find({ batchId }, null, { session: options.session });
}

const findByOrderId = async (orderId, options = {}) => {
    return await Batch.find({ orderId }, null, { session: options.session });
};

const newInstance = async (body, options = {}) => {
    const dbResults = new Batch(body)
    await dbResults.save({ session: options.session });
    return dbResults
}

const updateInstance = async (batchId, body, options = {}) => {
    return await Batch.findOneAndUpdate({ batchId }, body, { new: true, runValidators: true, session: options.session });
}

export default { findAll, findById, findByOrderId, newInstance, updateInstance }