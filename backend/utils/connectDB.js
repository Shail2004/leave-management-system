import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((c) => console.log("Database Connected"))
    .catch((e) => console.log(e));
};
