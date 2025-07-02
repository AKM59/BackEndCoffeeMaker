// -- Library & Plugins -- \\
import "dotenv/config";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";

// -- Var -- \\
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -- Fastify Init -- \\
const app = Fastify({ logger: true, logger: { level: 'debug', customLevels: { info: 1 }, transport: { target: 'pino-pretty' } } });
await app.register(AutoLoad, { dir: join(__dirname, 'src/routes'), options: { prefix: '/api' }, forceESM: true });
await app.register(AutoLoad, { dir: join(__dirname, 'src/plugins'), forceESM: true });

// -- 404 Handlers -- \\
await app.ready();

try {
    const url = await app.listen({ port: process.env.PORT, host: "0.0.0.0" })
    app.log.debug(`[APP] Server listening on %s`, url);
} catch (err) {
    app.log.error(`[APP] Error starting server: %s`, err);
    process.exit(1);
}

process.on('uncaughtException', (err) => app.log.error(err))
process.on('unhandledRejection', (err) => app.log.error(err))