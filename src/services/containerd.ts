import { exec as execCb } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { promisify } from "util";
import * as languageConfig from "../../config/language.json";
import { BadRequestError, NotFoundError } from "../utils/error-handler";
import handleExceptionError from "../utils/exception-error-handler";

interface LanguageProperties {
  imageTag: string;
  command: string;
  extension: string;
}

interface Languages {
  [key: string]: LanguageProperties;
}

interface LoadedImages {
  [key: string]: boolean;
}

interface LanguageExecutor {
  executeCode(language: string, code: string): Promise<string>;
}

/**
 * Executes commands for a specific language and code.
 */
class CommandExecutor implements LanguageExecutor {
  private exec = promisify(execCb);
  private writeFile = promisify(fs.writeFile);
  private unlink = promisify(fs.unlink);
  private fsExists = promisify(fs.exists);
  private loadedImages: LoadedImages = {};

  /**
   * Executes the provided code for the specified language.
   * @param language The language of the code.
   * @param code The code to execute.
   * @returns A promise that resolves to the result of the execution.
   * @throws {Error} If an error occurs during execution.
   */
  public async executeCode(language: string, code: string): Promise<string> {
    try {
      const languageProperties = await this.getLanguageProperties(language);
      const filename = await this.writeCodeToFile(languageProperties, code);
      const result = await this.executeCommand(
        language,
        languageProperties,
        filename
      );

      await this.unlink(filename);

      return result;
    } catch (error) {
      handleExceptionError(error as Error);
      throw error;
    }
  }

  /**
   * Retrieves the properties for the specified language.
   * @param language The language to retrieve properties for.
   * @returns A promise that resolves to the language properties.
   * @throws {BadRequestError} If the language is not supported.
   */
  private async getLanguageProperties(
    language: string
  ): Promise<LanguageProperties> {
    const languages: Languages = languageConfig;
    const languageProperties = languages[language];

    if (!languageProperties) {
      throw new BadRequestError(`Unsupported language: ${language}`);
    }

    return languageProperties;
  }

  /**
   * Writes the code to a file and returns the filename.
   * @param languageProperties The properties of the language.
   * @param code The code to write.
   * @returns A promise that resolves to the filename of the written file.
   */
  private async writeCodeToFile(
    languageProperties: LanguageProperties,
    code: string
  ): Promise<string> {
    const filename = path.join(
      os.homedir(),
      `index.${languageProperties.extension}`
    );
    await this.writeFile(filename, code);
    return filename;
  }

  /**
   * Executes the command for the specified language and filename.
   * @param language The language of the code.
   * @param languageProperties The properties of the language.
   * @param filename The filename of the code file.
   * @returns A promise that resolves to the result of the execution.
   * @throws {BadRequestError} If an error occurs during execution.
   */
  private async executeCommand(
    language: string,
    languageProperties: LanguageProperties,
    filename: string
  ): Promise<string> {
    await this.loadImage(language, languageProperties);

    const runCommand = `lima nerdctl run --rm --read-only --cap-drop ALL --pids-limit 64 --cpus="1" --memory="2g" --network none -v ${filename}:/home/cexa${filename}:ro --user nobody ${
      languageProperties.imageTag
    } ${languageProperties.command.replace("$FILE", "/home/cexa" + filename)}`;

    try {
      const { stdout, stderr } = await this.executeWithTimeout(
        runCommand,
        3000
      );

      if (stderr) {
        throw new BadRequestError(stderr);
      }

      return stdout;
    } catch (error) {
      throw new Error(
        (error as Error).message.replace(/Command failed: .*/, "")
      );
    }
  }

  /**
   * Loads the Docker image for the specified language if not already loaded.
   * @param language The language of the code.
   * @param languageProperties The properties of the language.
   * @throws {NotFoundError} If the image file does not exist.
   * @throws {Error} If an error occurs while loading the Docker image.
   */
  private async loadImage(
    language: string,
    languageProperties: LanguageProperties
  ): Promise<void> {
    const imagePath = path.resolve(
      __dirname,
      `../../docker/env/images/${language}.tar`
    );

    if (!(await this.fsExists(imagePath))) {
      throw new NotFoundError(`Image file does not exist: ${imagePath}`);
    }

    if (!this.loadedImages[languageProperties.imageTag]) {
      const loadImageCommand = `lima nerdctl load -i ${imagePath}`;

      try {
        await this.exec(loadImageCommand);
        this.loadedImages[languageProperties.imageTag] = true;
      } catch (error) {
        throw new Error(
          `Failed to load Docker image: ${(error as Error).message}`
        );
      }
    }
  }

  /**
   * Executes a command with a timeout.
   * @param command The command to execute.
   * @param timeout The timeout in milliseconds.
   * @returns A promise that resolves to the stdout and stderr of the command.
   * @throws {Error} If the command is empty or if the execution times out.
   */
  private async executeWithTimeout(
    command: string,
    timeout: number
  ): Promise<{ stdout: string; stderr: string }> {
    if (!command) {
      throw new Error("Command must not be empty");
    }

    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const process = execCb(command, { timeout }, (error, stdout, stderr) => {
        clearTimeout(timer);
        if (error) {
          reject(error);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error("Execution timed out"));
        } else {
          resolve({ stdout, stderr });
        }
      });

      const timer = setTimeout(() => {
        process.kill();
        reject(new Error("Execution timed out"));
      }, timeout);

      process.on("exit", () => {
        clearTimeout(timer);
      });
    });
  }
}

export default new CommandExecutor();
