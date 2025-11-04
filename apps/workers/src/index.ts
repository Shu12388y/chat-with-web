import { ScraperWorker, connectionInstance } from "@repo/queues/queue";
import { ENV } from "./env/env.js";
import { db, webcontentTable } from "@repo/drizzle/db";
import * as cheerio from "cheerio";
import { eq } from "drizzle-orm";
async function worker() {
  const connection = connectionInstance({
    uri: ENV.REDIS_URI!,
  });
  console.log("worker is on");

  const dbInstance = db({
    uri: ENV.DATABASE_URL!,
  });
  const ctx = ScraperWorker({
    workerName: "scrapper",
    connect: connection,
    callback: async (params) => {
      const html = await (await fetch(params.data.data.websiteURL)).text();
      const $ = cheerio.load(html);

      $("script,svg,nav,footer,header,noscript,iframe,style").remove();

      let text = $("body").text();
      text = text.replace(/\s+/g, "").trim();

      if (!text) {
        console.log("text not loaded");
        return;
      }
      await dbInstance
        .update(webcontentTable)
        .set({
          content: text,
          status: "completed",
        })
        .where(eq(webcontentTable.jobID, params.data.jobID));

      return {};
    },
  });
}

worker();
