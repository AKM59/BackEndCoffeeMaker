export default async function (app) {
    app.addHook('onRequest', async (req, res) => {
        req.startTime = process.hrtime.bigint();
    });

    app.get('/', async (req, res) => {
        const endTime = process.hrtime.bigint();
        const latencyNs = Number(endTime - req.startTime);
        const latencyMs = (latencyNs / 1_000_000).toFixed(3);

        return res.status(200).send({
            status: 'ok',
            latency: (`%s ms`, latencyMs),
            timestamp: new Date().toISOString()
        });
    });
}
