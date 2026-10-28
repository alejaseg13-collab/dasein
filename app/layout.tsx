import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sharpSans = localFont({
  src: [
    { path: "../public/fonts/sharp-sans/sharp-sans-light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/sharp-sans/sharp-sans.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/sharp-sans/sharp-sans-medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/sharp-sans/sharp-sans-semibold.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-sharp-sans",
  display: "swap",
});

const swarshDaisy = localFont({
  src: [{ path: "../public/fonts/swarsh-daisy/swarsh-daisy-italic.ttf", weight: "400", style: "italic" }],
  variable: "--font-swarsh-daisy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dasein Studio",
  description: "Estudio independiente. Desarrollo web/software | Marketing Digital | Branding",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${sharpSans.variable} ${swarshDaisy.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
