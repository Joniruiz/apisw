import "reflect-metadata"
import express from 'express';
import { Request, Response, NextFunction } from 'express';
const app = express()

import { verifyToken } from './controllers/verifyToken';

app.use((req:Request, res:Response, next:NextFunction)=>{
    if(req.method !== "GET" && req.method !== "DELETE" && req.method !== "POST"){
        res.status(501).json({error:"The requested method is not supported by the server and cannot be handled."})
    }else{
        next()
    }
})

app.use(express.json());

const routerFilm = require('./routes/film.routes');
if(process.env.NODE_ENV="test"){app.use('/film', routerFilm)}else{app.use('/film',verifyToken, routerFilm)}

const routerAuth = require('./routes/auth.routes');
app.use('/auth', routerAuth);

app.get("/",(req:Request, res:Response)=>{
    res.json({message:"Challenge"})
})


app.use((req:Request, res:Response)=>{
    console.log(req.method)
    console.log(req.body)
    console.log(req.path)
    res.status(404).json({error:"The requested page is not found."})
})

    


export default app;