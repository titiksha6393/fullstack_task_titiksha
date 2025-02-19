import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI as string;
mongoose.connect(mongoURI);

export default mongoose;
