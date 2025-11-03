import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(process.env.REDIS_URI as string);

export const ScraperQueue = ({ queueName }: { queueName: string }) => {
  const queue = new Queue(queueName, { connection });
  return queue;
};

export const ScraperWorker = ({
  workerName,
  callback,
}: {
  workerName: string;
  callback: (params: any) => {};
}) => {
  const worker = new Worker(
    workerName,
    async (job) => {
      callback(job);
    },
    { connection }
  );
  return worker;
};
