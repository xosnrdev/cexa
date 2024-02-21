import { config } from "dotenv";
import { cleanEnv, str } from "envalid";

config();

const env = cleanEnv(process.env, {
  PORT: str(),
  RATE_LIMIT_WINDOW_MS: str(),
  RATE_LIMIT_MAX: str(),
  NODE_ENV: str(),
});

export default env;
