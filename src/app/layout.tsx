import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header, Footer } from "@/widgets";
import { cn } from "@/shared/api/utils";
import { QueryProvider } from "@/shared/api/query-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server"; 

import "./globals.css";

export const metadata: Metadata = {
  title: "Uchkun",
  description: "Надежное производство во благо Кыргызстана",
  icons: {
    icon: "#",
  },
};

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export default async function RootLayout({ 
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html
      lang="ru"
      className={cn(
        "h-full antialiased",
        inter.variable
      )}
    >
      <body className="flex flex-col">
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}