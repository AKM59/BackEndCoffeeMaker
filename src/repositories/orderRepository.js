// -- Functions -- \\ 
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";

const findAll = async ({ page = 1, limit = 10 }) => {
    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (validatedPage - 1) * validatedLimit;

    const [results, total] = await Promise.all([
        Order.find().skip(skip).limit(validatedLimit).sort({ date: -1 }).lean().populate('customerId', 'company'),
        Order.countDocuments()
    ]);

    return { page: validatedPage, limit: validatedLimit, totalPages: Math.ceil(total / validatedLimit), totalResults: total, results };
};

const findFiltered = async (options = {}, filters = {}) => {
    const query = {};

    if (filters.companyid)
        query.customerId = filters.companyid;


    if (filters.status)
        query.status = filters.status;

    return await Order.find(query).session(options.session).populate({ path: 'customerId', select: 'company' }).exec();
};

const findpriorityOrder = async (options = {}) => {
    return await Order.findOne({ status: 'pending' }).sort({ priority: 1, date: 1 }).session(options.session).exec();
};

const findById = async (id, options = {}) => {
    return await Order.findById(id, null, { session: options.session });
};

const findbyCustomerId = async (customerId, options = {}) => {
    return await Order.find({ customerId }, null, { session: options.session });
};

const newInstance = async (body, options = {}) => {
    const newOrder = new Order(body);
    await newOrder.save({ session: options.session });
    return newOrder;
};

const updateInstance = async (id, body, options = {}) => {
    return await Order.findByIdAndUpdate(id, body, { new: true, runValidators: true, session: options.session });
};

const deleteInstance = async (id, options = {}) => {
    return await Order.findByIdAndUpdate(id, { status: 'cancelled', completedAt: new Date().toISOString() }, { new: true, runValidators: true, session: options.session });
};

export default { findAll, findFiltered, findById, findbyCustomerId, newInstance, updateInstance, deleteInstance, findpriorityOrder }