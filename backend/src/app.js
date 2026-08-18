import express from "express";

import cors from "cors";
import morgan from "morgan";

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan("dev"));
app.use(cors());

export default app;