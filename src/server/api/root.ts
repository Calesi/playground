import { router } from "~/server/api/trpc";
import { authRouter } from "./router/auth";
import { pbItemRouter } from "./router/pbItem";
import { pbOrderRouter } from "./router/pbOrder";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  auth: authRouter,
  pbItem: pbItemRouter,
  pbOrder: pbOrderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
