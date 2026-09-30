import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Services } from "@/components/sections/Services";
import { StatsCard } from "@/components/sections/StatsCard";
import { WhyUs } from "@/components/sections/WhyUs";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-primary px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {dict.common.skipToContent}
      </a>
      <Header lang={lang} copy={dict.header} common={dict.common} />
      <main id="main">
        <Hero copy={dict.hero} common={dict.common} />
        <StatsCard copy={dict.stats} />
        <Services copy={dict.services} />
        <WhyUs copy={dict.whyUs} />
        <HowItWorks copy={dict.process} />
        <Contact copy={dict.contact} common={dict.common} />
      </main>
    </>
  );
}
