import { type PbOrder } from "@prisma/client";

const PbOrderRow: React.FC<{
  pbOrder: PbOrder;
  onItemSelect?: () => void;
  onItemDelete?: () => void;
}> = ({ pbOrder, onItemDelete, onItemSelect }) => {
  return (
    <tr>
      <td
        className="border border-slate-600 bg-slate-600 text-center"
        onClick={onItemSelect}
      >
        {pbOrder.orderName}
      </td>
      <td className="text-center">
        <span
          className="cursor-pointer text-sm font-bold uppercase text-yellow-400"
          onClick={onItemSelect}
        >
          Select
        </span>
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

export default PbOrderRow;
