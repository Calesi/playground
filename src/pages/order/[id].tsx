import { useAuth } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-select";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { PbItemRow } from "~/components/pbItemRow";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/select";
import { api } from "~/utils/trpc";

type AddProductFormProps = {
  updateItems: (item: string) => void;
};

const AddProductForm = ({ updateItems }: AddProductFormProps) => {
  const pbItemQuery = api.pbItem.all.useQuery();

  const [selectedItem, setSelectedItem] = useState("");

  return (
    <div className="flex w-full max-w-2xl flex-col p-4">
      <button
        className="rounded bg-pink-400 p-2 font-bold"
        onClick={() => {
          updateItems(selectedItem);
          setSelectedItem("");
        }}
      >
        Create
      </button>
      {pbItemQuery.data ? (
        <>
          <Select onValueChange={(e) => setSelectedItem(e)}>
            <SelectTrigger className="w-full max-w-2xl overflow-hidden text-slate-200">
              <SelectValue placeholder="Select a Product" />
            </SelectTrigger>
            <SelectContent className="w-full max-w-2xl bg-gradient-to-b from-[#2e026d] to-[#15162c] text-slate-200">
              <SelectGroup>
                <SelectLabel>Products</SelectLabel>
                {pbItemQuery.data?.map((p) => {
                  return (
                    <>
                      <SelectItem key={p.id} value={p.id} className="">
                        {p.title}
                      </SelectItem>
                      <Separator className="my-4" />
                    </>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      ) : (
        <p>Loading..</p>
      )}
    </div>
  );
};

const Order = () => {
  const router = useRouter();
  const path = router.asPath.replace("/order/", "");
  const user = useAuth();

  if (typeof path !== "string") {
    return <div></div>;
  }
  const pbOrderQuery = api.pbOrder.byId.useQuery(path);

  const updateAddItem = (itemId: string) => {
    if (!pbOrderQuery.data || itemId === "") {
      return;
    }
    const orderItems: string[] = [];
    let itemExists = false;
    pbOrderQuery.data.items.forEach((item) => {
      if (item.id === itemId) {
        itemExists = true;
        return;
      }
      orderItems.push(item.id);
    });
    if (itemExists) return;

    updateOrderMutation.mutate({
      id: pbOrderQuery.data.id,
      items: [...orderItems, itemId],
    });
  };
  const updateRemoveItem = (itemId: string) => {
    if (!pbOrderQuery.data || itemId === "") {
      return;
    }
    const orderItems: string[] = [];

    pbOrderQuery.data.items.forEach((item) => {
      if (item.id !== itemId) {
        orderItems.push(item.id);
      }
    });

    updateOrderMutation.mutate({
      id: pbOrderQuery.data.id,
      items: [...orderItems],
    });
  };

  const updateOrderMutation = api.pbOrder.updateItems.useMutation({
    onSettled: () => pbOrderQuery.refetch(),
  });

  return (
    <>
      <Head>
        <title>Affordable Computers Price Checker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-r from-[#2e026d] to-[#15162c] bg-auto text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <Link href={"/"}>Affordable Computers Price Checker</Link>
          </h1>
          {!!user.isSignedIn && (
            <>
              <AddProductForm updateItems={updateAddItem} />

              {pbOrderQuery.data?.items ? (
                <>
                  <h3>Order: {pbOrderQuery.data.orderName}</h3>
                  <table className="table-fixed border-separate border-spacing-2 border border-slate-500">
                    <thead>
                      <tr>
                        <th className="w-96">Product</th>
                        <th className="w-96">Normal Price</th>
                        <th className="w-96">Affordable Price</th>
                        <th className="w-36"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pbOrderQuery.data?.items.map((p) => {
                        return (
                          <PbItemRow
                            key={p.id}
                            pbItem={p}
                            onItemDelete={() => updateRemoveItem(p.id)}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                <p>Loading..</p>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Order;
