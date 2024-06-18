import mongoose from "mongoose";

export const connectDatabase = () => {
    console.log(process.env.MONGO_URI)
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Discussion-forum",
    })
    .then((con) => console.log(`Database Connected with ${con.connection.host}`))
    .catch((err) => console.log(err));
};