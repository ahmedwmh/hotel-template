import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Najaf Hotel",
  description: "Hotel booking and information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
