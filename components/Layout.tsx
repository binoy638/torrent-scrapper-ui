import Head from "next/head";
import { ActionIcon, Text, useMantineColorScheme } from "@mantine/core";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
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
          <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? (
              <SunIcon style={{ height: "20px", width: "20x" }} />
            ) : (
              <MoonIcon style={{ height: "20px", width: "20x" }} />
            )}
          </ActionIcon>
        </div>
        <main className="px-4 lg:px-24 py-4 lg:py-12 h-screen">{children}</main>
      </section>
    </>
  );
}
