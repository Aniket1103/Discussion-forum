import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressFileUpload from 'express-fileupload';


const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(
//     expressFileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
//     useTempFiles: true,
//   })
// );
const USER_BASE_URL = process.env.USER_BASE_URL;
const DISCUSSION_BASE_URL = process.env.DISCUSSION_BASE_URL;

const proxyMiddleware = proxy(DISCUSSION_BASE_URL || "http://localhost:8002", {
    // proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    //     proxyReqOpts.headers['Content-Type'] = srcReq.headers['content-type'];
    //     return proxyReqOpts;
    // },
    proxyReqPathResolver: (req) => {
        return req.originalUrl; // To Preserve the original URL path
    },
    // proxyReqBodyDecorator: (bodyContent, srcReq) => {
    //     // Return the body content as is to handle multipart/form-data correctly
    //     return bodyContent;
    // },
    parseReqBody: false, // Disable body parsing by proxy
});


// app.get("/discussion/search", (req, res) => {
//     console.log(req.query)
//     res.send("Hello");
// })

app.use("/user", proxy(USER_BASE_URL || "http://localhost:8001"));
app.use("/discussion", proxyMiddleware);
// app.use("/", proxy("http://localhost:8002")); 

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});