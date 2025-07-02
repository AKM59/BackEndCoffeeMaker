// -- Libraries -- \\
import FastifyPlugin from 'fastify-plugin';
import mongoose from 'mongoose';

async function MongoDB(app) {
    try {
        mongoose.connection.on('connected', () => {
            app.log.debug('[MONGO] Connected to MongoDB ');
        });

        mongoose.connection.on('error', (err) => {
            app.log.error(`[MONGO] Connection error: %s`, err);
        });

        await mongoose.connect(process.env.MONGO_DB_URL, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });

        app.decorate('mongo', mongoose);
    } catch (err) {
        app.log.error(`[MONGO] Failed to connect to MongoDB: %s`, err);
        process.exit(1);
    }
}

export default FastifyPlugin(MongoDB);
