// import { router, publicProcedure, protectedProcedure } from "../trpc";
// import { z } from "zod";
// import axios from "axios";
// import { load } from "cheerio";

// export type PbItemType = {
//   id: string;
//   title: string;
//   normalPrice: string;
//   acPrice: string;
// };

// export const pbeScrapeRouter = router({
//   all: publicProcedure.query(async ({ ctx }) => {
//     const pbItems = await ctx.prisma.pbItem.findMany();
//     const itemsComplete: PbItemType[] = [];
//     if (pbItems.length < 1) {
//       return itemsComplete;
//     }
//     await Promise.all(
//       pbItems.map(async (pbItem) => {
//         const normalItem = await getPBItemByUrl(pbItem.url);
//         const acItem = await getPBitemByURLForAC(pbItem.url);
//         if (typeof normalItem != "string" && typeof acItem != "string") {
//           itemsComplete.push({
//             id: pbItem.id,
//             ...normalItem,
//             ...acItem,
//           });
//         }
//       }),
//     );

//     itemsComplete.sort((a: PbItemType, b: PbItemType) => {
//       if (a.id > b.id) return -1;
//       return 1;
//     });
//     return itemsComplete;
//   }),
//   byURL: publicProcedure.input(z.string()).query(async ({ input }) => {
//     const product = await getPBItemByUrl(input);
//     if (typeof product === "string") {
//       return {
//         id: "1",
//         title: "test",
//         price: `${"testDollar"}.${"testCents"}`,
//       };
//     }
//     return product;
//   }),
//   create: protectedProcedure
//     .input(
//       z.object({
//         url: z.string(),
//       }),
//     )
//     .mutation(({ ctx, input }) => {
//       return ctx.prisma.pbItem.create({
//         data: { ...input },
//       });
//     }),
//   delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
//     return ctx.prisma.pbItem.delete({ where: { id: input } });
//   }),
// });

// const getPBitemByURLForAC = async (url: string) => {
//   if (url == null) {
//     return "Error: No url entered.";
//   }

//   if (!url.includes("https://www.pbtech.co.nz/product/")) {
//     return "Error: Please Use a PB Tech Product Link";
//   }
//   const config = {
//     headers: {
//       Cookie:
//         "PHPSESSID=9b21ae5c50dbdc6a138165d3eb7a8251; pbuname=info%40affordablecomputers.co.nz; pbpword=%242a%2410%24bc4h7Nm%2FflB7AVn9bUC3AuLHS73WrafBMzSnuGCjwEgljWve3m.1i; expires=Tue, 16-Dec-2025 01:12:46 GMT; Max-Age=604800; path=/; domain=.www.pbtech.co.nz",
//     },
//   };
//   const response = await axios.get(url, config);

//   const loadedData = load(response.data);

//   const priceDollars = loadedData(
//     `div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-md-6.col-xl-4.col-xxl-3.mt-3.order-3.js-right-column div.product_bgWrap.p-3.bgcolor.rounded div.p_price_dd div:nth-child(2) div div.price_wrap.price_height_fix span.ginc span span.dollars`,
//   ).text();
//   const priceCents = loadedData(
//     `div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-md-6.col-xl-4.col-xxl-3.mt-3.order-3.js-right-column div.product_bgWrap.p-3.bgcolor.rounded div.p_price_dd div:nth-child(2) div div.price_wrap.price_height_fix span.ginc span span.explist_price_cents.mobile_cents.position-relative`,
//   ).text();
//   return { acPrice: `${priceDollars}.${priceCents}` };
// };

// const getPBItemByUrl = async (url: string) => {
//   if (url == null) {
//     return "Error: No url entered.";
//   }

//   if (!url.includes("https://www.pbtech.co.nz/product/")) {
//     return "Error: Please Use a PB Tech Product Link";
//   }
//   const response = await axios.get(url);

//   const loadedData = load(response.data);

//   const title = loadedData(
//     `div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-xl-8.col-xxl-9.js-product-header-block.product-header-block h1`,
//   ).text();
//   const priceDollars = loadedData(
//     `div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-md-6.col-xl-4.col-xxl-3.mt-3.order-3.js-right-column div.product_bgWrap.p-3.bgcolor.rounded div.p_price_dd div:nth-child(2) div div.price_wrap.price_height_fix span.ginc span span.dollars`,
//   ).text();
//   const priceCents = loadedData(
//     `div.bg-white.product_page_outer_wrap.d-print-none div div:nth-child(2) div.col-12.js-space-save-top.position-relative div div.col-12.col-md-6.col-xl-4.col-xxl-3.mt-3.order-3.js-right-column div.product_bgWrap.p-3.bgcolor.rounded div.p_price_dd div:nth-child(2) div div.price_wrap.price_height_fix span.ginc span span.explist_price_cents.mobile_cents.position-relative`,
//   ).text();
//   return { title, normalPrice: `${priceDollars}.${priceCents}` };
// };
