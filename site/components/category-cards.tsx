"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Category {
  title: string;
  description: string;
  image: string;
}

const categories: Category[] = [
  {
    title: "Catering & Party",
    description: "Werk op feesten, events en partijen waar altijd wat te doen is.",
    image: "/images/catering-staff-agency-B1T9L3ZT.webp",
  },
  {
    title: "Spoelkeuken",
    description: "Zorg dat alles in de keuken blijft draaien. Simpel werk, flexibele shifts.",
    image: "/images/spoelkeuken.png",
  },
  {
    title: "Keukenhulp",
    description: "Werk mee in de keuken en zorg dat alles soepel loopt achter de schermen.",
    image: "/images/female-chef-putting-glove-kitchen-BU66W3y4.webp",
  },
  {
    title: "Bediening",
    description: "Leuke uitdagende baan in de bediening in een horeca bedrijf.",
    image: "/images/personeel-9PiAN_zz.webp",
  },
];

export function CategoryCards() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 px-6 lg:hidden">
        {categories.map((cat, i) => (
          <Link
            key={cat.title}
            href="/vacatures"
            className="group relative overflow-hidden block h-48 sm:h-56"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${cat.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

            <div className="relative z-10 h-full flex flex-col justify-between p-5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{cat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{cat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: expand/shrink row */}
      <div
        className="hidden lg:flex flex-row gap-0 h-[600px]"
        onMouseLeave={() => setActive(null)}
      >
        {categories.map((cat, i) => {
          const isActive = active === i;
          const hasActive = active !== null;

          return (
            <Link
              key={cat.title}
              href="/vacatures"
              onMouseEnter={() => setActive(i)}
              className="group relative overflow-hidden cursor-pointer block"
              style={{
                flex: isActive ? 3 : hasActive ? 0.7 : 1,
                transition: "flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
                style={{
                  backgroundImage: `url('${cat.image}')`,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-8">
                {/* Number */}
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Bottom content */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {cat.title}
                  </h3>

                  {/* Description — slides in on active */}
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{
                      maxHeight: isActive ? "80px" : "0px",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                      {cat.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div
                    className="mt-3 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:border-white">
                      <ArrowUpRight className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
