import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora"
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans"
});


export const metadata = {
  title: "SOMEONE",
  description: "You Don't Need Everyone. You Just Need Someone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      {/* We apply both font variables, and set dmSans as the default sans font */}
      <body className={`${dmSans.variable} ${sora.variable} font-sans antialiased bg-brand-cream text-brand-dark`}>
        {children}
      </body>
    </html>
  );
}
