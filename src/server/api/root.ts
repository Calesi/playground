import { router } from "~/server/api/trpc";
import { authRouter } from "./router/auth";
import { pbeScrapeRouter } from "./router/pbItem";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  auth: authRouter,
  pbeScrape: pbeScrapeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
