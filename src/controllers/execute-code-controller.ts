import { NextFunction, Request, Response } from "express";
import Joi, { ValidationError } from "joi";
import { BadRequestError } from "../utils/error-handler";
import sendResponse from "../utils/send-response";
import CommandExecutor from "../services/container";
import languageConfig from "../../config/language.json";

interface ExecuteCodePayload {
  language: string;
  code: string;
}

/**
 * Executes the provided code based on the specified language.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 * @returns A Promise that resolves to the response object.
 * @throws {BadRequestError} If the request body is invalid.
 * @throws {Error} If an error occurs during code execution.
 */
async function executeCodeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isSupportedLanguage = Object.keys(languageConfig);
    const schema = Joi.object<ExecuteCodePayload>({
      language: Joi.string()
        .lowercase()
        .valid(...isSupportedLanguage)
        .required(),
      code: Joi.string().max(5000).required(),
    });

    const { error, value: payload } = schema.validate(req.body);
    if (error) {
      throw new BadRequestError((error as ValidationError).message);
    }

    const { language, code } = payload;

    const stdout = await CommandExecutor.executeCode(language, code);
    return sendResponse(res, res.statusCode, "", {
      stdout,
    });
  } catch (err) {
    next(err);
  }
}

export default executeCodeController;
