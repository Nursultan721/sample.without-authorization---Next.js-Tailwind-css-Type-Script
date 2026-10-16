import type { Metadata } from "next";
import {
  Inter,
} from "next/font/google";
import { Header, Footer } from "@/widgets";
import { cn } from "@/shared/api/utils";
import { QueryProvider } from "@/shared/api/query-provider";

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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={cn(
        "h-full antialiased",
        inter.variable
      )}
    >
      <body className="flex flex-col ">
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
