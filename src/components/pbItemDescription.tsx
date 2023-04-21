/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export const PbItemDescription: React.FC<{
  pbItem: inferProcedureOutput<AppRouter["pbItem"]["all"]>[number];
  onItemDelete?: () => void;
}> = ({ pbItem, onItemDelete }) => {
  return (
    <tr>
      <td className="border border-slate-600 bg-slate-600 text-center">
        {pbItem.description}
      </td>
      <td className="border border-slate-600 bg-slate-600 text-center">
        {pbItem.normalPrice}
      </td>
      <td
        className={`border border-slate-600 ${
          pbItem.affordablePrice! < pbItem.normalPrice!
            ? " text-green-500"
            : " text-red-500"
        } bg-slate-600 text-center`}
      >
        {pbItem.affordablePrice}
      </td>
      <td className="text-center">
        <span
          className="cursor-pointer text-sm font-bold uppercase text-pink-400"
          onClick={onItemDelete}
        >
          Delete
        </span>
      </td>
    </tr>
  );
};
