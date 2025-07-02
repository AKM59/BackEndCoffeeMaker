// -- Imports --
import { fetchAllOrders, fetchFilteredOrders, fetchOrderById, createNewOrder, fetchOrderByCustomerId, updateExistingOrder, deleteExistingOrder } from "../services/orderService.js";

/**
 * @method GET
 * @route /orders?page=X&limit=X
 * @name getAllOrders
 * @description Retrieve all orders from the database.
 */
export const getAllOrders = async (req, res) => {
    try {
        const orderData = await fetchAllOrders(req);
        if (!orderData.status) return res.code(400).send({ message: orderData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: orderData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method GET
 * @route /orders/filters?status | companyid
 * @name getFilteredOrders
 * @description Retrieve all orders filter for specific field.
 */
export const getFilteredOrders = async (req, res) => {
    try {
        const orderData = await fetchFilteredOrders(req);
        if (!orderData.status) return res.code(400).send({ message: orderData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: orderData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};


/**
 * @method GET
 * @route /orders/:id
 * @name getSpecificOrder
 * @description Retrieve a specific order by ID.
 */
export const getSpecificOrder = async (req, res) => {
    try {
        const orderData = await fetchOrderById(req);
        if (!orderData.status)
            return res.code(400).send({ message: orderData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: orderData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method GET
 * @route /orders/customer/:id
 * @name getOrdersByCustomer
 * @description Retrieve all orders associated with a specific customer ID.
 */
export const getOrdersByCustomer = async (req, res) => {
    try {
        const orderData = await fetchOrderByCustomerId(req);
        if (!orderData.status)
            return res.code(400).send({ message: orderData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: orderData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method POST
 * @route /orders
 * @name createOrder
 * @description Create a new order in the database.
 * 
 * @body {string} customerId - Required. MongoDB ObjectId referencing the customer.
 * @body {number} quantity - Required. Minimum 1.
 * @body {string} fullAddress - Required. Shipping address.
 * @body {string} status - Optional. One of: "pending", "processing", "shipped", "delivered", "cancelled". Default: "pending".
 * @body {number} priority - Optional. Integer from 1 (lowest) to 5 (highest). Default: 3.
 * @body {string} completedAt - Optional. ISO 8601 date string indicating completion date.
 */
export const createOrder = async (req, res) => {
    try {
        const orderData = await createNewOrder(req);
        if (!orderData.status)
            return res.code(400).send({ message: orderData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: orderData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method PATCH
 * @route /orders/:id
 * @name updateOrder
 * @description Update an existing order by ID and apply new fields (priority & status)
 * @body {Object} fieldsToUpdate - The fields to be updated in the order.
 */
export const updateOrder = async (req, res) => {
    try {
        const orderData = await updateExistingOrder(req);
        if (!orderData.status)
            return res.code(400).send({ message: orderData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: orderData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};

/**
 * @method DELETE
 * @route /orders/:id
 * @name deleteOrder
 * @description Update an existing order by ID and apply the status of 'cancelled'
 */
export const deleteOrder = async (req, res) => {
    try {
        const orderData = await deleteExistingOrder(req);
        if (!orderData.status)
            return res.code(400).send({ message: orderData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: orderData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};