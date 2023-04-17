/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export type PbOrderType = {
  id: string;
  orderName: string;
  items: string[];
};

export const pbeScrapeRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const pbOrders = await ctx.prisma.pbOrder.findMany();
    return pbOrders;
  }),
  byTitle: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.pbOrder.findFirst({ where: { orderName: input } });
  }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        items: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.pbOrder.create({
        data: {
          orderName: input.title,
          orderItems: JSON.stringify(input.items),
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.pbItem.delete({ where: { id: input } });
  }),
});
