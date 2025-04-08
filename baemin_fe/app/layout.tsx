import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import HeaderNav from "@/components/headerNav";
import FooterNav from "@/components/footerNav";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baemin",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-fit">
        {/* <Provider store={store}> */}
        <HeaderNav />
        <AntdRegistry>{children}</AntdRegistry>
        {/* </Provider> */}
      </body>
    </html>
  );
}
