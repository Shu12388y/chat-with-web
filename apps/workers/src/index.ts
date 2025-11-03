import { ScraperWorker } from "@repo/queues/queue";

async function worker() {
  const ctx = ScraperWorker({
    workerName: "scrapper",
    callback: (params) => {
      return {};
    },
  });
}
