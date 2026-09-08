import { hc } from "hono/client";
import type app from "./index.js";

export const client = hc<typeof app>("/");
export type ApiType = typeof app;
