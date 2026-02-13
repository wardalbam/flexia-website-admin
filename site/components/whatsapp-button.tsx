"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "../lib/utils";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/31682712876"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center justify-center",
        "w-12 h-12 rounded-full",
        "bg-[#25D366] text-white shadow-layered",
        "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:scale-105"
      )}
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
