// -- Library --
import Joi from "joi";
import mongoose from "mongoose";
import orderRepository from "../repositories/orderRepository.js";
import batchRepository from "../repositories/batchRepository.js";
import { haversine } from "../functions/haversine.js";

export const fetchAllOrders = async (req) => {
    const page = req.query.page
    const limit = req.query.limit

    try {
        const data = await orderRepository.findAll({ page, limit });
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

export const fetchFilteredOrders = async (req) => {
    const status = req.query.status;
    const companyid = req.query.companyid;

    try {
        const data = await orderRepository.findFiltered({}, { companyid: companyid, status: status });
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }

}

export const fetchOrderById = async (req) => {
    const { id } = req.params;
    if (!id) return { status: false, message: `ID supplied is invalid ${id}.` };

    try {
        const data = await orderRepository.findById(id);
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

export const fetchOrderByCustomerId = async (req) => {
    const { id } = req.params;
    if (!id) return { status: false, message: `ID supplied is invalid ${id}.` };

    try {
        const data = await orderRepository.findbyCustomerId(id);
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

export const createNewOrder = async (req, app) => {
    // Orders schema & validation
    const orderSchema = Joi.object({
        customerId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        fullAddress: Joi.string().required(),
        status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled').default('pending'),
        priority: Joi.number().integer().min(1).max(5).default(3),
        completedAt: Joi.date().iso().optional(),
    });

    const { error, value } = orderSchema.validate(req.body);
    if (error) return { status: false, message: error.details[0].message };

    // Geo data
    const geoData = await haversine(value.fullAddress);
    if (!geoData) return { status: false, message: "Address fetch failed. Address might be invalid. Please try again." };

    // Batch data
    const batchId = `${geoData.factoryCode}-${[...Array(4)].map(() => Math.floor(Math.random() * 9) + 1).join('')}`;
    const batchData = { batchId, pieces: value.quantity, productionSite: geoData.factoryCode };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const orderData = await orderRepository.newInstance(value, { session });
        batchData.orderId = orderData._id;

        await batchRepository.newInstance(batchData, { session });
        await session.commitTransaction();

        return { status: true, message: orderData };
    } catch (err) {
        await session.abortTransaction();
        return { status: false, message: err.message };
    } finally {
        session.endSession();
    }

};

export const updateExistingOrder = async (req) => {
    const { id } = req.params;
    if (!id) return { status: false, message: `ID supplied is invalid ${id}.` };

    const orderSchema = Joi.object({
        priority: Joi.number().integer().min(1).max(5).default(3),
        status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled'),
        completedAt: Joi.date().iso()
    });

    const { error, value } = orderSchema.validate(req.body);
    if (error) return { status: false, message: error.details[0].message };

    if (value.status === 'completed' && !value.completedAt)
        return { status: false, message: "The `completedAt` field must be supplied when completing the order." };

    try {
        const data = await orderRepository.updateInstance(id, value);
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: ("Failed to Update Instance with id: (%s).", id) };
    }
};

export const deleteExistingOrder = async (req) => {
    const { id } = req.params;
    if (!id) return { status: false, message: `ID supplied is invalid ${id}.` };

    try {
        const data = await orderRepository.deleteInstance(id);
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: ("Failed to Update Instance with id: (%s).", id) };
    }
};