import express from 'express';
const app = express();
const router = express.Router();
router.get('/:id', (req, res) => res.send('matched /:id with ' + req.params.id));
router.get('/event/:eventId', (req, res) => res.send('matched /event/:eventId with ' + req.params.eventId));
app.use('/tables', router);
import http from 'http';
const server = http.createServer(app);
server.listen(4001, () => {
    import('child_process').then(cp => {
        cp.exec('curl http://localhost:4001/tables/event/123', (err, stdout) => {
            console.log("RESULT:", stdout);
            process.exit(0);
        });
    });
});
