import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WIPDF",
  description: "支持 Windsurf 和 Cursor Invoice模板的随机Invoice生成Web应用程序，可以生成随机的Invoice数据并支持PDF导出。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
