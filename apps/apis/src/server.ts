import express, { Express } from "express";
import cors from "cors";
import { router } from "./routes/route.js";
export const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use("/api/v1", router);
