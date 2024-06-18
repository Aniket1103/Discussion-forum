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
const BASE_URL = process.env.BASE_URL || "http://localhost";

const proxyMiddleware = proxy(BASE_URL + ":8002", {
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

app.use("/user", proxy(BASE_URL + ":8001"));
app.use("/discussion", proxyMiddleware);
// app.use("/", proxy("http://localhost:8002")); 

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});