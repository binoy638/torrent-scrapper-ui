import Head from "next/head";
import { ActionIcon, Text, useMantineColorScheme } from "@mantine/core";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <>
      <Head>
        <title>Torrent Ocean</title>
        <meta name="description" content="torrent search engine" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="">
        <div
          onClick={() => toggleColorScheme()}
          className=" absolute right-0 px-4 py-4"
        >
          <Text>
            {colorScheme === "dark" ? (
              <SunIcon className="h-5 w-5 text-yellow-100 cursor-pointer" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
            )}
          </Text>
        </div>
        <main className="px-4 lg:px-24 py-4 lg:py-12 h-screen">{children}</main>
      </section>
    </>
  );
}
