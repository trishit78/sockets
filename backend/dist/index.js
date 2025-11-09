import express, {} from 'express';
const app = express();
app.get('/', (_req, res) => {
    res.send('helo');
});
app.listen(3000, () => {
    console.log('server is running on 3000');
});
//# sourceMappingURL=index.js.map