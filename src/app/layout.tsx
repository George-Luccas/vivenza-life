import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["700"], variable: "--font-dancing" });

export const metadata: Metadata = {
  title: "Vivenza Life",
  description: "Vivenza Life Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} ${dancingScript.variable}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            themes={["light", "dark", "rose-yellow"]}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
