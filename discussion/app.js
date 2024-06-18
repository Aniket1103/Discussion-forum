import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import discussion from './routes/discussion.js'
import comment from './routes/comment.js'
import bodyParser from 'body-parser';
import expressFileUpload from 'express-fileupload';
import { createDiscussion } from './controllers/discussion.js';
import { isAuthenticated } from './middleware/auth.js';

config({
    path: "./config/config.env"
})

export const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true, // to allow credentials (cookies, authorization headers, etc.)
};
    
    // For browser cors policies
app.use(express.json());
// app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
// app.use(expressFileUpload({
//     useTempFiles: true,
//     tempFileDir: '/tmp/',
// }));

app.use(
    expressFileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  })
);
app.use(cors());

// app.post('/discussion/comment/create', (req, res) => {
//     console.log(req.query);
//     res.send("hello search")
// })
// app.post('/discussion/create', isAuthenticated, createDiscussion)
// app.post('/discussion/comment/create', (req, res)=> {
//     res.send("hello")
// })
app.use('/discussion/comment', comment);
app.use('/discussion', discussion);

