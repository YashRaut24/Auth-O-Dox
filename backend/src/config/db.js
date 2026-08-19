import mongoose from "mongoose";
import config from "./config.js";

function connectDB(){
    mongoose.connect(config.MONGO_URI)
    .then(() => {console.log("MOngoDB Connected to the Server")})
    .catch(error => console.log(error));
}

export default connectDB;