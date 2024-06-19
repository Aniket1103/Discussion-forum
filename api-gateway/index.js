import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import NodeCache from 'node-cache';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressFileUpload from 'express-fileupload';


const app = express();
app.use(cors());
app.use(express.json());
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(
//     expressFileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
//     useTempFiles: true,
//   })
// );
const USER_BASE_URL = process.env.USER_BASE_URL || "http://localhost:8001";
const DISCUSSION_BASE_URL = process.env.DISCUSSION_BASE_URL || "http://localhost:8002";

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

app.use('/', async (req, res, next) => {
  const key = req.originalUrl + "&token=" + req.cookies?.token;
  console.log(req.method);

  if(req.method === 'GET' && (req.cookies.token && req.cookies.token.length > 0)){
      // Check if response is in cache
      const cachedResponse = cache.get(key);
      if (cachedResponse) {
        console.log('Cache hit for', key);
        res.send(JSON.parse(cachedResponse));
        return;
      }
  }

  console.log('Cache miss for', key);

  // Determine which service to proxy to
  let targetUrl;
  if (req.path.startsWith('/user')) {
    targetUrl = USER_BASE_URL;
  } else if (req.path.startsWith('/discussion')) {
    targetUrl = DISCUSSION_BASE_URL;
  } else {
    res.status(404).send('Not Found');
    return;
  }

  // Use proxy
  proxy(targetUrl, {
    // proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    //   proxyReqOpts.headers['Content-Type'] = 'application/json';
    //   return proxyReqOpts;
    // },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      // Storing response in cache
      const responseData = proxyResData.toString('utf8');
    //   console.log(responseData)
      if(req.method === 'GET') cache.set(key, responseData);
      return (responseData);
    },
    parseReqBody: false
  })(req, res, next);
});

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

// app.use("/user", proxy(USER_BASE_URL || "http://localhost:8001"));
// app.use("/discussion", proxyMiddleware);
// app.use("/", proxy("http://localhost:8002")); 

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});