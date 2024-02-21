import { exec as execCb } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { promisify } from "util";
import * as languageConfig from "../../config/language.json";
import { BadRequestError } from "../utils/error-handler";
import handleExceptionError from "../utils/exception-error-handler";

interface LanguageProperties {
  imageTag: string;
  command: string;
  extension: string;
}

interface Languages {
  [key: string]: LanguageProperties;
}

interface PulledImages {
  [key: string]: boolean;
}

interface LanguageExecutor {
  executeCode(language: string, code: string): Promise<string>;
}

class CommandExecutor implements LanguageExecutor {
  private exec = promisify(execCb);
  private writeFile = promisify(fs.writeFile);
  private unlink = promisify(fs.unlink);
  private isPulledImage: PulledImages = {};

  public async executeCode(language: string, code: string): Promise<string> {
    try {
      const languageProperties = await this.getLanguageProperties(language);
      const filename = await this.writeCodeToFile(languageProperties, code);
      const result = await this.executeCommand(languageProperties, filename);

      await this.unlink(filename);

      return result;
    } catch (error) {
      handleExceptionError(error as Error);
      throw error;
    }
  }

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

  private async executeCommand(
    languageProperties: LanguageProperties,
    filename: string
  ): Promise<string> {
    await this.loadImage(languageProperties);

    const runCommand = `docker run --rm --read-only --cap-drop ALL --pids-limit 32 --cpu-shares 512 --memory="1g" --network none -v ${filename}:${filename}:ro --user cexa ${
      languageProperties.imageTag
    } ${languageProperties.command.replace("$FILE", filename)}`;

    try {
      const { stdout, stderr } = await this.executeWithTimeout(
        runCommand,
        5000
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

  private async loadImage(
    languageProperties: LanguageProperties
  ): Promise<void> {
    if (!this.isPulledImage[languageProperties.imageTag]) {
      const pullImageCommand = `docker pull ${languageProperties.imageTag}`;
      try {
        await this.exec(pullImageCommand);
        this.isPulledImage[languageProperties.imageTag] = true;
      } catch (error) {
        throw new Error(
          `Failed to pull Docker image: ${(error as Error).message}`
        );
      }
    }
  }

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
