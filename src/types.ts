import type { Auth } from "./auth";
import type { DB } from "./db";
import type { Env } from "./env";

export type AppEnv = {
  Bindings: Env;
  Variables: {
    db: DB;
    auth: Auth;
    userId: string;
  };
};
