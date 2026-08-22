import { hc } from "hono/client";
import type app from "./index";

export const client = hc<typeof app>("/");
export type ApiType = typeof app;
