// -- Libraries -- \\
import { Schema, model } from 'mongoose';

const machineDataSchema = new Schema(
    {
        /* CNC */
        cycleTime: Number,
        cuttingDepth: Number,
        vibration: Number,
        toolAlarms: String,

        /* Lathe */
        machineStatus: String,
        spindleSpeed: Number,
        spindleTemperature: Number,
        completedParts: Number,

        /* Assembly Line */
        avgStationTime: Number,
        operatorCount: Number,
        anomalies: String,

        /* Test Line */
        testResult: String,
        boilerPressure: Number,
        boilerTemperature: Number,
        energyConsumption: Number,

    },
    {
        _id: false

    }
);

const machineLogSchema = new Schema(
    {
        batchId: { type: String, required: true },
        machineType: { type: String, enum: ['cnc', 'assembly', 'test', 'lathe'], required: true },
        location: { type: String, required: true },
        utcTimestamp: { type: Date, },
        machineBlocked: { type: Boolean, default: false },
        blockReason: { type: String },
        lastMaintenance: { type: Date },
        machineData: { type: machineDataSchema, default: {} }
    },
    {
        timestamps: true,
        collection: 'MachineLog'
    }
);

export default model('MachineLog', machineLogSchema);
