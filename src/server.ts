import cluster, { Worker } from "cluster";
import os from "os";
import logger from "./utils/logger";
import WorkerProcess from "./app";

interface WorkerExitInfo {
  worker: Worker;
  code: number;
  signal: string;
}

/**
 * Represents the primary process responsible for managing worker processes.
 */
class PrimaryProcess {
  private numCPUs: number;

  /**
   * Creates an instance of PrimaryProcess.
   */
  constructor() {
    this.numCPUs = os.cpus().length;
  }

  /**
   * Starts the primary process.
   */
  public start(): void {
    if (cluster.isPrimary) {
      logger.info(`Primary ${process.pid} is running`);

      this.forkWorkers();

      cluster.on("exit", (worker: Worker, code: number, signal: string) => {
        this.handleWorkerExit({ worker, code, signal });
      });

      process.on("SIGTERM", () => {
        this.gracefulShutdown();
      });
    }
  }

  /**
   * Forks worker processes based on the number of CPUs available.
   */
  private forkWorkers(): void {
    for (let i = 0; i < this.numCPUs; i++) {
      this.createWorker();
    }
  }

  /**
   * Creates a new worker process.
   */
  private createWorker(): void {
    const worker = cluster.fork();
    logger.info(`Worker ${worker.process.pid} started`);
  }

  /**
   * Handles the exit of a worker process.
   * @param exitInfo - The information about the worker process exit.
   */
  private handleWorkerExit(exitInfo: WorkerExitInfo): void {
    const { worker, code, signal } = exitInfo;

    if (signal) {
      logger.error(
        `Worker ${worker.process.pid} was killed by signal: ${signal}`
      );
    } else if (code !== 0) {
      logger.error(
        `Worker ${worker.process.pid} exited with error code: ${code}`
      );
    } else {
      logger.info(`Worker ${worker.process.pid} success!`);
    }

    this.createWorker();
  }

  /**
   * Performs a graceful shutdown of the primary process and its worker processes.
   */
  private gracefulShutdown(): void {
    logger.info(
      "Primary process received SIGTERM signal. Shutting down gracefully."
    );

    cluster.disconnect(() => {
      logger.info("All workers disconnected successfully. Exiting process.");
      process.exit(0);
    });
  }
}

class ClusterManager {
  constructor() {}

  public start(): void {
    if (!cluster.isPrimary) {
      WorkerProcess.start();
      this.handleWorkerErrors();
    }
  }

  private handleWorkerErrors(): void {
    process.on("uncaughtException", (err) => {
      logger.error("Unhandled Exception", err);
      process.exit(1);
    });

    process.on("unhandledRejection", (err, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", err);
      process.exit(1);
    });
  }
}

if (cluster.isPrimary) {
  new PrimaryProcess().start();
} else {
  new ClusterManager().start();
}
