import type { Metadata } from "next"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "FABR-NETWORK-ADM",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="shortcut icon" href="/assets/favicon.png" type="image/x-icon" />
      </head>
      <body className="bg-[#272731]">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
