// -- Library --
import batchRepository from "../repositories/batchRepository.js";

export const fetchAllBatch = async (req) => {
    const page = req.query.page
    const limit = req.query.limit

    try {
        const data = await batchRepository.findAll({ page, limit });
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};


export const fetchByOrderId = async (req) => {
    const id = req.query.id;
    if (!id) return { status: false, message: `ID supplied is invalid ${id}.` };

    try {
        const data = await batchRepository.findByOrderId(id)
        return { status: true, message: data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};