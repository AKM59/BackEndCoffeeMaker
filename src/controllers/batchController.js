// -- Imports --
import { fetchAllBatch, fetchByOrderId } from "../services/batchService.js";


/**
 * @method GET
 * @route /batches?page=X&limit=X
 * @name getAllBatch
 * @description Retrieve all batch from the database.
 */
export const getAllBatch = async (req, res) => {
    try {
        const batchData = await fetchAllBatch(req);
        if (!batchData.status)
            return res.code(400).send({ message: batchData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: batchData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};


/**
 * @method GET
 * @route /batches/orders?id=:id
 * @name getAllBatch
 * @description Retrieve batchs associated with a specific order
 */
export const getBatchByOrderId = async (req, res) => {
    try {
        const batchData = await fetchByOrderId(req);
        if (!batchData.status)
            return res.code(400).send({ message: batchData.message, timestamp: new Date().toISOString() });

        res.code(200).send({ data: batchData.message ?? [], timestamp: new Date().toISOString() });
    } catch (err) {
        res.code(500).send({ error: err.message, timestamp: new Date().toISOString() });
    }
};
