import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  MapPin,
  Briefcase,
  Euro,
  Building2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { AnimatedSection } from "../../../components/animated-section";

type Vacature = {
  id: string;
  slug: string;
  vacatureNumber: number;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  seoContent: string;
  requirements: string[];
  benefits: string[];
  category: { id: string; name: string; slug: string } | null;
  companyName: string | null;
  imageKey: string;
  employmentType: string[];
  city: string;
  location: string | null;
  salary: number;
  isActive: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  TEMPORARY: "TEMPORARY",
  INTERN: "INTERN",
  VOLUNTEER: "VOLUNTEER",
  PER_DIEM: "PER_DIEM",
  OTHER: "OTHER",
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Fulltime",
  PART_TIME: "Parttime",
  TEMPORARY: "Tijdelijk",
  INTERN: "Stage",
  VOLUNTEER: "Vrijwilliger",
  PER_DIEM: "Oproepbasis",
  OTHER: "Overig",
};

async function getVacature(id: string): Promise<Vacature | null> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/vacatures/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vacature = await getVacature(id);
  if (!vacature) {
    return { title: "Vacature niet gevonden — Flexia" };
  }

  return {
    title: `${vacature.title} — Flexia`,
    description: vacature.description,
    openGraph: {
      title: `${vacature.title} — Flexia`,
      description: vacature.description,
      url: `https://www.flexiajobs.nl/vacatures/${vacature.slug}`,
      siteName: "Flexia",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${vacature.title} — Flexia`,
      description: vacature.description,
    },
  };
}

function buildJobPostingJsonLd(vacature: Vacature) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacature.title,
    description: `<p>${vacature.description}</p><p>${vacature.longDescription}</p>`,
    datePosted: vacature.publishedAt,
    validThrough: new Date(
      new Date(vacature.publishedAt).getTime() + 90 * 24 * 60 * 60 * 1000
    ).toISOString(),
    employmentType: vacature.employmentType.map(
      (t) => EMPLOYMENT_TYPE_MAP[t] || t
    ),
    hiringOrganization: {
      "@type": "Organization",
      name: vacature.companyName || "Flexia",
      sameAs: "https://www.flexiajobs.nl",
      logo: "https://www.flexiajobs.nl/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: vacature.city,
        addressCountry: "NL",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        value: vacature.salary,
        unitText: "HOUR",
      },
    },
    industry: "Horeca",
    jobLocationType: "TELECOMMUTE" as string | undefined,
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function VacatureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vacature = await getVacature(id);

  if (!vacature) {
    notFound();
  }

  const jsonLd = buildJobPostingJsonLd(vacature);
  // Remove telecommute — this is on-site hospitality work
  delete jsonLd.jobLocationType;

  return (
    <>
      {/* Google for Jobs structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Dark hero bar with back link ── */}
      <section className="surface-dark relative overflow-hidden">
        <div className="mesh-blob mesh-brand animate-mesh w-[500px] h-[500px] opacity-40 -top-32 left-1/3" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-16">
          <AnimatedSection>
            <Link
              href="/vacatures"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors group mb-6"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="animated-underline">Alle vacatures</span>
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.05}>
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className="text-sm font-semibold text-[var(--brand)] tracking-wide uppercase">
                {vacature.category?.name || "Algemeen"}
              </span>
              <span className="text-white/30">|</span>
              <span className="text-sm text-white/50">
                #{vacature.vacatureNumber}
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-[1.1] max-w-3xl">
              {vacature.title}
            </h1>
          </AnimatedSection>

          {vacature.subtitle && (
            <AnimatedSection delay={0.15}>
              <p className="mt-4 text-lg text-white/50 max-w-2xl leading-relaxed">
                {vacature.subtitle}
              </p>
            </AnimatedSection>
          )}

          {/* Key info pills */}
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 text-white/80 bg-white/5">
                <MapPin className="h-4 w-4 text-white/50" /> {vacature.city}
              </span>
              {vacature.employmentType?.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 text-white/80 bg-white/5"
                >
                  <Briefcase className="h-4 w-4 text-white/50" />{" "}
                  {EMPLOYMENT_TYPE_LABELS[type] || type.replace("_", " ")}
                </span>
              ))}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 text-white/80 bg-white/5">
                <Euro className="h-4 w-4 text-white/50" /> &euro;
                {vacature.salary}/uur
              </span>
              {vacature.companyName && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/15 text-white/80 bg-white/5">
                  <Building2 className="h-4 w-4 text-white/50" />{" "}
                  {vacature.companyName}
                </span>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />
      </section>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Left column — content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <AnimatedSection>
              <div className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight">
                  Over de functie
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {vacature.longDescription || vacature.description}
                </p>
              </div>
            </AnimatedSection>

            <hr className="section-divider" />

            {/* Requirements */}
            {vacature.requirements?.length > 0 && (
              <AnimatedSection delay={0.05}>
                <div className="space-y-5">
                  <h2 className="text-xl font-bold tracking-tight">
                    Wat wij zoeken
                  </h2>
                  <ul className="space-y-3">
                    {vacature.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[var(--brand)] mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Benefits */}
            {vacature.benefits?.length > 0 && (
              <AnimatedSection delay={0.1}>
                <div className="space-y-5">
                  <h2 className="text-xl font-bold tracking-tight">
                    Wat wij bieden
                  </h2>
                  <ul className="space-y-3">
                    {vacature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[var(--brand)] mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* SEO Content */}
            {vacature.seoContent && (
              <>
                <hr className="section-divider" />
                <AnimatedSection delay={0.15}>
                  <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                    {vacature.seoContent}
                  </div>
                </AnimatedSection>
              </>
            )}
          </div>

          {/* Right column — sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Apply card */}
              <AnimatedSection animation="slide-right">
                <div className="rounded-2xl border border-border bg-card shadow-layered p-6 space-y-5">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight">
                      Interesse?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Solliciteer direct op deze vacature.
                    </p>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold h-12 text-base group"
                  >
                    <Link href={`/vacatures/${vacature.id}/apply`}>
                      Solliciteer nu
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>

                  <div className="pt-4 border-t border-border flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>Wij reageren binnen 24 uur</span>
                  </div>
                </div>
              </AnimatedSection>

              {/* Details card */}
              <AnimatedSection animation="slide-right" delay={0.1}>
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Details
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Locatie
                      </dt>
                      <dd className="font-medium">{vacature.city}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <Euro className="h-4 w-4" /> Salaris
                      </dt>
                      <dd className="font-medium">
                        &euro;{vacature.salary}/uur
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Type
                      </dt>
                      <dd className="font-medium">
                        {vacature.employmentType
                          ?.map(
                            (t) =>
                              EMPLOYMENT_TYPE_LABELS[t] || t.replace("_", " ")
                          )
                          .join(", ")}
                      </dd>
                    </div>
                    {vacature.companyName && (
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground flex items-center gap-2">
                          <Building2 className="h-4 w-4" /> Bedrijf
                        </dt>
                        <dd className="font-medium">
                          {vacature.companyName}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Geplaatst
                      </dt>
                      <dd className="font-medium">
                        {formatDate(vacature.publishedAt)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA band ── */}
      <section className="surface-dark py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Klaar om te solliciteren?
            </h2>
            <p className="text-white/50 mt-2 max-w-lg mx-auto">
              Solliciteer direct op deze vacature of bekijk onze andere
              openstaande functies.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                variant="brand"
                className="rounded-full px-8 py-3 text-base font-semibold"
              >
                <Link href={`/vacatures/${vacature.id}/apply`}>
                  Solliciteer nu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="rounded-full px-8 py-3 text-base font-semibold border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/vacatures">Alle vacatures bekijken</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
