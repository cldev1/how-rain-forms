import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dew — How Rain Forms",
  description:
    "A cheerful 3D lesson for toddlers: watch Dew the dewdrop show how rain forms.",
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
