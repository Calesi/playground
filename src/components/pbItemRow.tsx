import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export const PbItemRow: React.FC<{
  pbItem: inferProcedureOutput<AppRouter["pbItem"]["all"]>[number];
  onItemDelete?: () => void;
  onRouteClick?: () => void;
}> = ({ pbItem, onItemDelete, onRouteClick }) => {
  if (!pbItem.affordablePrice || !pbItem.normalPrice) {
    return <div></div>;
  }
  return (
    <tr onClick={onRouteClick} className="cursor-pointer">
      <td className="border border-slate-600 bg-slate-600 text-center">
        {pbItem.title}
      </td>
      <td className="border border-slate-600 bg-slate-600 text-center">
        {pbItem.normalPrice}
      </td>
      <td
        className={`border border-slate-600 ${
          pbItem.affordablePrice < pbItem.normalPrice
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
