// -- Library & Functions -- \\
import FastifyPlugin from "fastify-plugin";
import { ServiceBusClient } from "@azure/service-bus";
import { insertMachineLog } from "../../services/queueService.js";

async function ServiceBusClientInit(app) {
    const sbClient = new ServiceBusClient(process.env.QUEUE_URL);
    const receiver = sbClient.createReceiver(process.env.QUEUE_NAME, { receiveMode: 'peekLock' });

    const messageHandler = async (messageReceived) => await insertMachineLog(messageReceived, receiver);
    const errorHandler = async (err) => app.log.error(`[APP] Error when handling instance on queue: %s`, err);

    receiver.subscribe({ processMessage: messageHandler, processError: errorHandler });
}

export default FastifyPlugin(ServiceBusClientInit);