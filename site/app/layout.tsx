import React from "react";
import "./globals.css";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { WhatsAppButton } from "../components/whatsapp-button";

export const metadata = {
  title: "Flexia Jobs - Flexibel Horeca Personeel",
  description: "De flexibele kracht achter jouw horecateam. Werk wanneer jij wilt, personeel wanneer jij het nodig hebt.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
