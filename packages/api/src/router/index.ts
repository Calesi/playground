import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
// import { pbeScrapeRouter } from "./pbeScrape";

export const appRouter = router({
  auth: authRouter,
  example: exampleRouter,
  // pbeScrape: pbeScrapeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
