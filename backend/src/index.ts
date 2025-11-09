import express, { type Request, type Response } from 'express';


const app = express();


app.get('/',(_req:Request,res:Response)=>{
    res.send('helo')
});

app.listen(3000,()=>{
    console.log('server is running on 3000')
})