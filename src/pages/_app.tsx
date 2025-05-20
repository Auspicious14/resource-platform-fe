import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { AppContextProvider } from "@/context";
import RootLayout from "@/modules/layout";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <RootLayout>
        <Component {...pageProps} />
        <Analytics />
      </RootLayout>
    </AppContextProvider>
  );
}
