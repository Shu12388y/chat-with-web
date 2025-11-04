import { Request, Response } from "express";
import { connectionInstance, ScraperQueue } from "@repo/queues/queue";
import { ENV } from "../env/env.js";
import { dbInstance } from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import { webcontentTable } from "@repo/drizzle/db";
import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

export class Controller {
  static async getWebURI(
    req: Request<any, any, { uri: string }>,
    res: Response
  ) {
    try {
      const data = req.body;
      const { uri } = data;
      const connection = connectionInstance({
        uri: ENV.REDIS_URI!,
      });
      const queue = ScraperQueue({
        queueName: "scrapper",
        connect: connection,
      });

      const jobID = uuidv4();
      const queueInfo = {
        jobID: jobID,
        data: {
          websiteURL: uri,
        },
        status: "queued",
      };
      queue.add("web-scrape-data", queueInfo);

      const dbValue = {
        jobID: jobID,
        websiteUrl: uri,
        status: "queued" as const,
      };
      await dbInstance.insert(webcontentTable).values(dbValue);

      res.status(200).json({
        message: {
          jobID: queueInfo?.jobID,
          status: queueInfo?.status,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  static async getStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "JOB ID is required" });
        return;
      }
      // find if the job exists
      const isJobIdExists = await dbInstance
        .select()
        .from(webcontentTable)
        .where(eq(webcontentTable.jobID, id));

      if (
        !isJobIdExists ||
        (Array.isArray(isJobIdExists) && isJobIdExists.length === 0)
      ) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      res.status(200).json({ data: isJobIdExists[0]?.status });
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  }

  static async chat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const { message } = data;
      if (!id) {
        res.status(404).json({ message: "JOB ID is requried" });
        return;
      }

      const isContentExtracted = await dbInstance
        .select()
        .from(webcontentTable)
        .where(eq(webcontentTable.jobID, id));
      if (
        !isContentExtracted ||
        (Array.isArray(isContentExtracted) && isContentExtracted.length == 0)
      ) {
        res.status(401).json({ message: "Website content is not extracted" });
      }

      if (isContentExtracted[0]?.status == "queued") {
        res.status(400).json({ message: "Website content is not extracted" });
        return;
      }

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      // res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      const ai = new GoogleGenAI({
        apiKey: ENV.API_KEY!,
      });

      const response = await ai.models.generateContentStream({
        contents: `Hi there is a message ${message} and here the content ${isContentExtracted[0]?.content}. Using this content give me the simple response of my question`,
        model: "gemini-2.5-flash",
      });

      for await (const chuck of response) {
        res.write(chuck.text?.toString());
      }
      res.end();
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  }
}
