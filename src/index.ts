import { getLength, runCode } from './mark.js';
import express from "express"
import bodyParser from 'body-parser';
import mongoose, { ObjectId } from 'mongoose';
import cors from "cors"
import { Request, } from 'express';




const app = express();
const port = process.env.PORT || parseInt(process.argv[2]) || 3000;


const corsOptions = {
     origin: "*"
}

app.use(bodyParser.json());
app.use(cors())

type ProcessorNames = '4001' | '4002' | '4003' | '4004' | '8004' | '8005' | '8006' | '8007'

interface bodyRequest {
     processor: ProcessorNames;
     maxSteps: number;
     memory: Array<number>;
     registers: Record<string, number>;


}

app.post('/submitProgram', async (req: Request<{}, {}, bodyRequest>, res) => {
     try {
          const body = req.body;

          const finalState = runCode(body.memory, body.registers, body.processor, body.maxSteps);
          res.status(200).json(finalState)


     } catch (err) {
          res.status(500).json({ msg: "Internal Server Error!!!" })
          console.log(err);
          return;

     }



})


app.listen(port, () => {
     console.log(`Listening on port: ${port}`)




})