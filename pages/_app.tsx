import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  NormalizeCSS,
  GlobalStyles,
} from "@mantine/core";
import { useState } from "react";
import "../styles/globals.scss";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionOptions={{ key: "mantine", prepend: false }}
          theme={{ colorScheme }}
        >
          <NormalizeCSS />
          <GlobalStyles />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
