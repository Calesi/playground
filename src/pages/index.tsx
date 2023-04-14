import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { trpc } from "~/utils/trpc";

const Home: NextPage = () => {
  const { isSignedIn } = useAuth();

  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Jim&apos;s Playground</title>
        <meta name="description" content="A playground for me to do stuff" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#cff4f9] to-[#095669] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(60,67%,58%)]">
              Jim&apos;s Playground
            </span>
          </h1>
          <div>
            {!isSignedIn && <SignInButton />}
            {!!isSignedIn && <SignOutButton />}
          </div>

          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
