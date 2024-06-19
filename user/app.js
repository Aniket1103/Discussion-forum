import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import user from './routes/user.js'

config({
    path: "./config/config.env"
})

export const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true, // to allow credentials (cookies, authorization headers, etc.)
};

// For browser cors policies
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/user', user);