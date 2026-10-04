import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Puzzle — Public House",
    template: "%s | The Puzzle",
  },
  description:
    "Boa bebida, comida honesta e mesas feitas para conversas longas. O pub onde a cidade se encontra.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
