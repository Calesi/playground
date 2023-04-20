/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { object, z } from "zod";
import SuperJSON from "superjson";
import { type PbItem } from "@prisma/client";

export type PbOrderType = {
  id: string;
  orderName: string;
  items: PbItem[];
};
type PbOrderItemsJsonObject = {
  json: string[];
};

export const pbOrderRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const pbOrders = await ctx.prisma.pbOrder.findMany();

    return pbOrders;
  }),
  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const pbOrder = await ctx.prisma.pbOrder.findFirst({
      where: { id: input },
    });
    if (!pbOrder) {
      return null;
    }

    const pbItemsIds = pbOrder.orderItems as string;
    const pbItemIdsParsed = SuperJSON.parse<string[]>(pbItemsIds);
    const pbItems: PbItem[] = [];
    await Promise.all(
      pbItemIdsParsed.map(async (pbItem) => {
        const item = await ctx.prisma.pbItem.findFirst({
          where: { id: pbItem },
        });
        if (item) {
          pbItems.push(item);
        }
      })
    );
    return { id: pbOrder.id, orderName: pbOrder.orderName, items: pbItems };
  }),
  create: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.pbOrder.create({
        data: {
          orderName: input,
          orderItems: SuperJSON.stringify([]),
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.pbOrder.delete({ where: { id: input } });
  }),
  updateItems: protectedProcedure
    .input(z.object({ id: z.string(), items: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.pbOrder.findFirst({
        where: { id: input.id },
      });
      if (!order) {
        return;
      }
      return ctx.prisma.pbOrder.update({
        where: { id: input.id },
        data: {
          orderItems: SuperJSON.stringify([...input.items]),
        },
      });
    }),
});
