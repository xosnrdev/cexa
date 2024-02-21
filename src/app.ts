import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { Server } from "http";
import PayloadCompressor from "./utils/compression";
import env from "./utils/env";
import logger from "./utils/logger";
import sendResponse from "./utils/send-response";
import errorHandlerMiddleware from "./middlewares/error-handler-middleware";
import rateLimitMiddleware from "./middlewares/rate-limit-middleware";
import { router } from "./routes";

/**
 * Represents a worker process that handles HTTP requests.
 */
class WorkerProcess {
  private app: Express;

  /**
   * Creates a new instance of the WorkerProcess class.
   */
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();

    this.app.set('trust proxy', 1);
  }

  /**
   * Starts the worker process and listens for incoming requests.
   * @returns The server instance.
   */
  start(): Server {
    const server = this.app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
    return server;
  }

  /**
   * Sets up the middlewares for the worker process.
   */
  private setupMiddlewares() {
    this.app.use(helmet());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(rateLimitMiddleware());
    this.app.use(this.compressionMiddleware);
    this.app.use(this.decompressionMiddleware);
  }

  /**
   * Sets up the routes for the worker process.
   */
  private setupRoutes() {
    this.app.use("/", router);
  }

  /**
   * Sets up the error handling for the worker process.
   */
  private setupErrorHandling() {
    this.app.use(errorHandlerMiddleware);
  }

  /**
   * Middleware function that compresses the request payload.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  private compressionMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body || typeof req.body !== "object") {
      return sendResponse(res, 400, "Data is missing or not an object");
    }

    try {
      const inputData = JSON.stringify(req.body);
      const compressedData = await PayloadCompressor.compressPayload(inputData);
      req.body.compressedData = compressedData;
      next();
    } catch (error) {
      sendResponse(res, 500, "Compression error", {
        error: (error as Error).message,
      });
    }
  };

  /**
   * Middleware function that decompresses the request payload.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   */
  private decompressionMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.compressedData) {
      try {
        const decompressedData = await PayloadCompressor.decompressPayload(
          req.body.compressedData
        );
        req.body = JSON.parse(decompressedData);
      } catch (error) {
        return sendResponse(res, 500, "Decompression error", {
          error: (error as Error).message,
        });
      }
    }
    next();
  };
}

export default new WorkerProcess();
