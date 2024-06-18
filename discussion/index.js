import { app } from './app.js';
import { connectCloudinary } from './config/cloudinary.js';
import { connectDatabase } from "./config/database.js";

connectCloudinary();
connectDatabase();

const PORT = process.env.PORT || "8002";
app.listen(PORT,  () => {
  console.log(`Server Listening to Port: ${PORT}`);
})