
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from "./routes/user.js"
import publicationRoutes from "./routes/publication.js"
import cors from 'cors'

import { config } from "dotenv";
config();

const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDBURL;


const app = express();

// middleware  
app.use(cors());
app.use(express.json())
app.use(express.static('public'))

// routes 

 app.use('/api/user',userRoutes);
 app.use('/api/publication',publicationRoutes);

// connecter database  
mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log('App connected to database');
        app.listen(PORT , ()=>{
            console.log(`App is listening to port : ${PORT}`);
        })
    })
    .catch((error)=>{
        console.log(error);
    })
