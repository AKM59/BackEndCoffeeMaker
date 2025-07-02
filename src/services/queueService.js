// -- Library -- \\ 
import mongoose from "mongoose";

import MachineLog from "../models/MachineLog.js";
import orderRepository from "../repositories/orderRepository.js";
import batchRepository from "../repositories/batchRepository.js";

export const insertMachineLog = async (messageReceived, receiver) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const body = messageReceived.body;
    const factoryLog = new MachineLog();
    const machineData = factoryLog.machineData;

    try {
        const orderData = await batchRepository.findById(body.codice_lotto);
        if (orderData == []) throw new Error("Batch not found");


        if (orderData[0].status !== 'completed' && orderData[0].currentStation === 'cnc') {
            await batchRepository.updateInstance(body.codice_lotto, { status: 'in_production' }, { session });
        }

        if (body.macchina == 'test' && body.esito_test === 'OK') {
            await orderRepository.updateInstance(orderData[0].orderId.toString(), { status: 'completed' }, { session });
            await batchRepository.updateInstance(body.codice_lotto, { status: 'completed' }, { session });
        }

        factoryLog.batchId = body.codice_lotto;
        factoryLog.machineType = body.macchina;
        factoryLog.location = body.luogo;
        factoryLog.utcTimestamp = body.timestamp_utc;
        factoryLog.machineBlocked = body.blocco_macchina;
        factoryLog.blockReason = body.motivo_blocco;
        factoryLog.lastMaintenance = body.ultima_manutenzione;

        switch (body.macchina) {
            case 'cnc':
                machineData.cycleTime = body.tempo_ciclo;
                machineData.cuttingDepth = body.profondita_taglio;
                machineData.vibration = body.vibrazione;
                machineData.toolAlarms = body.allarmi_utente;
                break;

            case 'lathe':
                machineData.machineStatus = body.stato_macchina;
                machineData.spindleSpeed = body.velocita_rotazione;
                machineData.spindleTemperature = body.temperatura_mandrino;
                machineData.completedParts = body.pezzi_completati;
                break;

            case 'assembly':
                machineData.avgStationTime = body.tempo_medio_stazione;
                machineData.operatorCount = body.numero_operatori;
                machineData.anomalies = body.anomalie;
                break;

            case 'test':
                machineData.testResult = body.esito_test;
                machineData.boilerPressure = body.pressione_caldaia;
                machineData.boilerTemperature = body.temperatura_caldaia;
                machineData.energyConsumption = body.consumo_energetico;
                break;
            default:
                console.warn(`[APP] - Unknown machine type received: %s`, body.macchina);
                await receiver.abandonMessage(messageReceived);
                await session.abortTransaction();

                return { status: false, message: "Unknow machine type received" };
        }

        await batchRepository.updateInstance(body.codice_lotto, { currentStation: body.macchina }, { session })
        await factoryLog.save({ session: session })
        await receiver.completeMessage(messageReceived);
        await session.commitTransaction();

        return { status: true, message: null };
    } catch (error) {
        console.log("[APP] - Log Failed to Insert %s:", error);
        await session.abortTransaction();
        await receiver.abandonMessage(messageReceived);
        return { status: false, message: error.message };
    } finally {
        session.endSession();
    }
};

