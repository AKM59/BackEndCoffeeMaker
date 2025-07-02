// -- Library --
import Joi from "joi";
import customerRepository from "../repositories/customerRepository.js";

export const fetchAllCustomers = async (req) => {
    const page = req.query.page
    const limit = req.query.limit

    try {
        const data = await customerRepository.findAll({ page, limit });
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

export const fetchCustomerById = async (req) => {
    const { id } = req.params;
    if (!id) return { status: false, message: `ID supplied is invalid ${id}.` };

    try {
        const data = await customerRepository.findById(id);
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

export const createNewCustomer = async (req) => {
    const customerSchema = Joi.object({
        company: Joi.string().min(2).max(100).required(),
        address: Joi.string().required(),
        country: Joi.string().length(2).uppercase().required(),
        vat: Joi.string().required(),
        email: Joi.string().email().required()
    });

    const { error, value } = customerSchema.validate(req.body);
    if (error) return { status: false, message: error.details[0].message };

    try {
        const data = await customerRepository.newInstance(value);
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

export const updateExistingCustomer = async (req) => {
    const { id } = req.params;
    if (!id) return { status: false, message: `ID supplied is invalid ${id}.` };

    const customerSchema = Joi.object({
        company: Joi.string().min(2).max(100),
        address: Joi.string(),
        country: Joi.string().length(2).uppercase(),
        vat: Joi.string(),
        email: Joi.string().email()
    });

    const { error, value } = customerSchema.validate(req.body);
    if (error) return { status: false, message: error.details[0].message };

    try {
        const data = await customerRepository.updateInstance(id, value);
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

export const deleteExistingCustomer = async (req) => {
    const { id } = req.params;
    if (!id) return { status: false, message: `ID supplied is invalid ${id}.` };

    try {
        const data = await customerRepository.deleteInstance(id);
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};