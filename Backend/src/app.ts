import { config } from './config';
import express from 'express';
import cluster from 'cluster';
// import { logger } from './utils/logger';
import { cpus } from 'os';
//import controllers
import { healthcheck } from './controllers/controller-healthcheck';
import { getTime, sampleTransaction, insertLog, getQuertData } from './controllers/controller-sample';
import path from 'path';
import cors from 'cors';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    // create a worker for each CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        console.info(`worker online, worker id: ${worker.id}`);
    });
    //if worker dies, create another one
    cluster.on('exit', (worker, code, signal) => {
        console.error(
            `worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`
        );
        cluster.fork();
    });
} else {
    //create express app
    const app: express.Express = express();
    app.use(cors())
    const router: express.Router = express.Router();

    app.use(express.json());
    app.use(router); // tell the app this is the router we are using
    //healthcheck routes
    router.get('/', healthcheck);
    app.get('/queryUI', (req, res) => {
        // Send the HTML file as a response
        res.sendFile(path.join(__dirname, 'controllers', 'UI/index.html'));
      });
    router.get('/healthcheck', healthcheck);
    // sampleController routes
    router.get('/servertime', getTime);
    router.get('/transaction', sampleTransaction);
    router.post('/insertlog', insertLog )

    router.post('/queryData', getQuertData)

    app.listen(config.port, function () {
        const workerId =
            cluster.worker && cluster.worker.id ? cluster.worker.id : undefined;
        console.info(
            `worker started: ${workerId} | server listening on port: ${config.port}`
        );
    });
}
