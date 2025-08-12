import type { Metadata } from "next";
import "./styles/global.scss";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Ascent",
  description: "A placeholder architecture website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}