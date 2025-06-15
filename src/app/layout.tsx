import type { Metadata } from "next";
import "./styles/global.scss";

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
      <body>{children}</body>
    </html>
  );
}
