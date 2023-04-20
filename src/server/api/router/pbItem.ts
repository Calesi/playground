/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import axios from "axios";
import { type CheerioAPI, load } from "cheerio";

export const pbItemRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const pbItems = await ctx.prisma.pbItem.findMany();
    return pbItems;
  }),
  byURL: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.pbItem.findFirst({ where: { url: input } });
  }),
  updatePrices: publicProcedure.query(async ({ ctx }) => {
    const pbItems = await ctx.prisma.pbItem.findMany();
    if (!pbItems) {
      return { message: "Not Found" };
    }
    await Promise.all(
      pbItems.map(async (pbItem) => {
        const normalItem = await getPBItemByUrl(pbItem.url);
        const affordableItem = await getPBitemByURLForAC(pbItem.url);
        if (
          typeof normalItem != "string" &&
          typeof affordableItem != "string"
        ) {
          await ctx.prisma.pbItem.update({
            where: { id: pbItem.id },
            data: { ...normalItem, ...affordableItem },
          });
        }
      })
    );
    return { message: "Done" };
  }),
  create: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const normalItem = await getPBItemByUrl(input.url);
      const affordableItem = await getPBitemByURLForAC(input.url);
      if (typeof normalItem != "string" && typeof affordableItem != "string") {
        return ctx.prisma.pbItem.create({
          data: { ...input, ...normalItem, ...affordableItem },
        });
      }

      return;
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.pbItem.delete({ where: { id: input } });
  }),
});

const getPBitemByURLForAC = async (url: string) => {
  if (url == null) {
    return "Error: No url entered.";
  }

  if (!url.includes("https://www.pbtech.co.nz/product/")) {
    return "Error: Please Use a PB Tech Product Link";
  }
  const config = {
    headers: {
      Cookie:
        "PHPSESSID=9b21ae5c50dbdc6a138165d3eb7a8251; pbuname=info%40affordablecomputers.co.nz; pbpword=%242a%2410%24bc4h7Nm%2FflB7AVn9bUC3AuLHS73WrafBMzSnuGCjwEgljWve3m.1i; expires=Tue, 16-Dec-2025 01:12:46 GMT; Max-Age=604800; path=/; domain=.www.pbtech.co.nz",
    },
  };
  const response = await axios.get(url, config);

  const loadedData = load(response.data);

  const actualPrice = getDollars(loadedData);
  return { affordablePrice: actualPrice };
};

const getPBItemByUrl = async (url: string) => {
  if (url == null) {
    return "Error: No url entered.";
  }

  if (!url.includes("https://www.pbtech.co.nz/product/")) {
    return "Error: Please Use a PB Tech Product Link";
  }
  const response = await axios.get(url);

  const loadedData = load(response.data);

  const title = loadedData(
    `div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-xl-8.col-xxl-9.js-product-header-block.product-header-block h1`
  ).text();

  const actualPrice = getDollars(loadedData);
  return { title, normalPrice: actualPrice };
};

const getDollars = (loadedData: CheerioAPI) => {
  let priceDollars = loadedData(
    `div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-md-6.col-xl-4.col-xxl-3.mt-3.order-3.js-right-column div.product_bgWrap.p-3.bgcolor.rounded div.p_price_dd div:nth-child(2) div div.price_wrap.price_height_fix span.ginc span span.dollars`
  ).text();
  let priceCents = loadedData(
    `div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-md-6.col-xl-4.col-xxl-3.mt-3.order-3.js-right-column div.product_bgWrap.p-3.bgcolor.rounded div.p_price_dd div:nth-child(2) div div.price_wrap.price_height_fix span.ginc span span.explist_price_cents.mobile_cents.position-relative`
  ).text();

  priceDollars = priceDollars.replace("$", "");
  let priceDollarsInt = parseInt(priceDollars);
  let priceCentsInt = parseInt(priceCents) / 100;
  let actualPrice = priceDollarsInt + priceCentsInt;

  // Maybe Promo?
  if (Number.isNaN(actualPrice)) {
    priceDollars = loadedData(
      "div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-md-6.col-xl-4.col-xxl-3.mt-3.order-3.js-right-column div.product_bgWrap.p-3.bgcolor.rounded div.p_price_dd div.promo-image-info-container.d-flex.align-items-center.justify-content-center.py-3 div div div.d-flex div.pe-4.position-relative.price_height_fix span.ginc span span.dollars"
    ).text();
    priceCents = loadedData(
      "div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-md-6.col-xl-4.col-xxl-3.mt-3.order-3.js-right-column div.product_bgWrap.p-3.bgcolor.rounded div.p_price_dd div.promo-image-info-container.d-flex.align-items-center.justify-content-center.py-3 div div div.d-flex div.pe-4.position-relative.price_height_fix span.ginc span span.explist_price_cents.mobile_cents"
    ).text();

    priceDollars = priceDollars.replace("$", "");
    priceDollarsInt = parseInt(priceDollars);
    priceCentsInt = parseInt(priceCents) / 100;
    actualPrice = priceDollarsInt + priceCentsInt;
  }
  if (Number.isNaN(actualPrice)) {
    return 0;
  }
  return actualPrice;
};
