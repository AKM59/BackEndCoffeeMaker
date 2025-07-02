// -- Imports --
import { fetchAllCustomers, fetchCustomerById, createNewCustomer, updateExistingCustomer, deleteExistingCustomer } from "../services/customerService.js";

/**
 * @method GET
 * @route /customers?page=X&limit=X
 * @name getAllCustomers
 * @description Retrieve all customers from the database.
 */
export const getAllCustomers = async (req, res) => {
    try {
        const customerData = await fetchAllCustomers(req);
        if (!customerData.status)
            return res.code(400).send({ message: customerData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: customerData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method GET
 * @route /customers/:id
 * @name getSpecificCustomer
 * @description Retrieve a specific customer by ID.
 */
export const getSpecificCustomer = async (req, res) => {
    try {
        const customerData = await fetchCustomerById(req);
        if (!customerData.status)
            return res.code(400).send({ message: customerData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: customerData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method POST
 * @route /customers
 * @name createCustomer
 * @description Create a new customer in the database.
 * @body {string} company - Required, min 2, max 100
 * @body {string} address - Required
 * @body {string} country - Required, country code
 * @body {string} vat - Required
 * @body {string} email - Required, unique
 */
export const createCustomer = async (req, res) => {
    try {
        const customerData = await createNewCustomer(req);
        if (!customerData.status)
            return res.code(400).send({ message: customerData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: customerData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method PATCH
 * @route /customers/:id
 * @name updateCustomer
 * @description Update an existing customer's information.
 * @body {Object} fieldsToUpdate - Fields to update
 */
export const updateCustomer = async (req, res) => {
    try {
        const customerData = await updateExistingCustomer(req);
        if (!customerData.status)
            return res.code(400).send({ message: customerData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: customerData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method DELETE
 * @route /customers/:id
 * @name deleteCustomer
 * @description Delete a customer by ID.
 */
export const deleteCustomer = async (req, res) => {
    try {
        const customerData = await deleteExistingCustomer(req);
        if (!customerData.status)
            return res.code(400).send({ message: customerData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: customerData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};