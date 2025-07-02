import { getAllBatch, getBatchByOrderId } from "../../controllers/batchController.js";

export default async function (app) {
    app.get('/batches', getAllBatch)
    app.get('/batches/orders', getBatchByOrderId);
}