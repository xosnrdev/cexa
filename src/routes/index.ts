import { Request, Response, Router } from "express";
import executeCodeController from "../controllers/execute-code-controller";

export const router = Router();

router.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "Welcome to CEXA v1",
      timestamp: new Date().toISOString(),
    },
  });
});

router.post("/execute", executeCodeController);
