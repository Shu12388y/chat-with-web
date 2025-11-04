import express,{Express} from "express";
import cors from "cors"
import { router } from "./routes/route.js";
export const app:Express = express();


app.use(express.json());
app.use(cors());
app.use("/api/v1",router);