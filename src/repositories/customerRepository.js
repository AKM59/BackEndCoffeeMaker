// -- Functions -- \\ 
import Customer from "../models/Customer.js";

const findAll = async ({ page = 1, limit = 10 }) => {
    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (validatedPage - 1) * validatedLimit;

    const [results, total] = await Promise.all([
        Customer.find().skip(skip).limit(validatedLimit).sort({ date: -1 }).lean(),
        Customer.countDocuments()
    ]);

    return { page: validatedPage, limit: validatedLimit, totalPages: Math.ceil(total / validatedLimit), totalResults: total, results };
};

const findById = async (id, options = {}) => {
    return await Customer.findById(id, null, { session: options.session });
}

const newInstance = async (body, options = {}) => {
    const newCustomer = new Customer(body);
    await newCustomer.save({ session: options.session });
    return newCustomer;
}

const updateInstance = async (id, body, options = {}) => {
    return await Customer.findByIdAndUpdate(id, body, { new: true, runValidators: true, session: options.session });
}

const deleteInstance = async (id, options = {}) => {
    return await Customer.findByIdAndDelete(id, { session: options.session });
}

export default { findAll, findById, newInstance, updateInstance, deleteInstance }