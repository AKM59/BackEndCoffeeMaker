// -- Libraries -- \\
import { fetch } from "undici";
import mongoose from "mongoose";
import fastifyPlugin from "fastify-plugin";

import orderRepository from "../../repositories/orderRepository.js";
import batchRepository from "../../repositories/batchRepository.js";


async function scheduleOrders(app) {
    const productionNotify = async (body, url) => {
        const Location = { "IT": 'Italia', "BR": 'Brasile', "VN": 'Vietnam' }
        body.productionSite = Location[body.productionSite];

        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (!response.ok) throw new Error(`Request Failed, Status: %s`, response.status);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    };


    const processNextOrder = async () => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const nextOrder = await orderRepository.findpriorityOrder();
            if (!nextOrder) { await session.abortTransaction(); return false; }

            await orderRepository.updateInstance(nextOrder.id, { status: 'processing' }, { session });
            const batchData = await batchRepository.findByOrderId(nextOrder.id, { session });

            await batchRepository.updateInstance(batchData[0].batchId, { status: 'in_production' }, { session });
            await productionNotify({ batchId: batchData[0].batchId, productionSite: batchData[0].productionSite, pieces: batchData[0].pieces }, process.env.BACKEND_ENDPOINT);

            await session.commitTransaction();
            app.log.debug("[APP] Processed Order ID %s linked to Batch ID %s. (Priority: %d)", nextOrder.id, batchData[0].batchId, nextOrder.priority);

        } catch (error) {
            await session.abortTransaction();
            app.log.error(`[APP] Error processing order: %s`, error.message);
        } finally {
            await session.endSession();
        }
    }

    setInterval(processNextOrder, process.env.ORDER_FETCHING_TIME * 60 * 1000);
}

export default fastifyPlugin(scheduleOrders);
