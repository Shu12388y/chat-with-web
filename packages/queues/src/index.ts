import { ConnectionOptions, Queue, Worker } from "bullmq";
import { Redis } from "ioredis";

export const connectionInstance = ({ uri }: { uri: string }) => {
  const connection = new Redis(uri,{maxRetriesPerRequest:null});
  return connection;
};

export const ScraperQueue = ({
  queueName,
  connect,
}: {
  queueName: string;
  connect: ConnectionOptions;
}) => {
  const queue = new Queue(queueName, { connection: connect });
  return queue;
};

export const ScraperWorker = ({
  workerName,
  callback,
  connect,
}: {
  workerName: string;
  connect: ConnectionOptions;
  callback: (params: any) => {};
}) => {
  const worker = new Worker(
    workerName,
    async (job) => {
      callback(job);
    },
    { connection: connect }
  );
  return worker;
};
