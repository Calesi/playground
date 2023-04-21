import type { NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/trpc";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import PbOrderRow from "../components/pbOrderRow";
import { useRouter } from "next/router";

const CreateItemForm: React.FC = () => {
  const utils = api.useContext();
  const router = useRouter();

  const [url, setUrl] = useState("");

  const { mutate } = api.pbItem.create.useMutation({
    async onSuccess() {
      setUrl("");
      await utils.pbItem.all.invalidate();
    },
  });

  const route = (path: string) => {
    void router.push(path);
  };

  return (
    <div className="flex w-full max-w-2xl flex-col p-4">
      <h3>Add Item to database</h3>
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="PB Tech Url"
      />
      <button
        className="rounded bg-pink-400 p-2 font-bold"
        onClick={() => {
          mutate(url);
        }}
      >
        Create
      </button>
      <button
        className="rounded bg-blue-300 p-2 font-bold"
        onClick={() => route("/item")}
      >
        Go to Items
      </button>
    </div>
  );
};

const CreateOrderForm: React.FC = () => {
  const utils = api.useContext();
  const router = useRouter();
  const [orderName, setOrderName] = useState("");

  const { mutate } = api.pbOrder.create.useMutation({
    async onSuccess(data) {
      setOrderName("");
      await utils.pbOrder.all.invalidate();
      if (data) {
        route(`/order/${data?.id}`);
      }
    },
  });

  const route = (path: string) => {
    void router.push(path);
  };

  return (
    <div className="flex w-full max-w-2xl flex-col p-2">
      <h3>Start Order</h3>
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={orderName}
        onChange={(e) => setOrderName(e.target.value)}
        placeholder="Order Name"
      />
      <button
        className="rounded bg-pink-400 p-2 font-bold"
        onClick={() => {
          mutate(orderName);
        }}
      >
        Create
      </button>
      <button
        className="rounded bg-blue-300 p-2 font-bold"
        onClick={() => route("/order")}
      >
        Go to Orders
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useAuth();
  const router = useRouter();
  const pbOrderQuery = api.pbOrder.all.useQuery();

  const route = (path: string) => {
    void router.push(path);
  };

  const deleteItemMutation = api.pbOrder.delete.useMutation({
    onSettled: () => pbOrderQuery.refetch(),
  });
  return (
    <>
      <Head>
        <title>Affordable Computers Price Checker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-6 overflow-hidden px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Affordable Computers Price Checker
          </h1>

          <div>
            {!user.isSignedIn && <SignInButton />}
            {!!user.isSignedIn && <SignOutButton />}
          </div>
          {!!user.isSignedIn && (
            <>
              <CreateItemForm />
              <CreateOrderForm />
              {pbOrderQuery.data ? (
                <>
                  <table className="table-fixed border-separate border-spacing-1 border border-slate-500">
                    <thead>
                      <tr>
                        <th className="w-96">Order</th>
                        <th className="w-36"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pbOrderQuery.data.map((p) => {
                        return (
                          <PbOrderRow
                            key={p.id}
                            pbOrder={p}
                            onItemDelete={() => deleteItemMutation.mutate(p.id)}
                            onItemSelect={() => route(`/order/${p.id}`)}
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

export default Home;
