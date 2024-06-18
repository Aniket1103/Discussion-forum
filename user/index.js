import { app } from './app.js';
import { connectDatabase } from "./config/database.js";

connectDatabase();

const PORT = process.env.PORT || "8001";
app.listen(PORT,  () => {
  console.log(`Server Listening to Port: ${PORT}`);
})