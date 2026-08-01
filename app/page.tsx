import { connection } from "next/server";
import { About } from "@/components/landing/about";
import { Care } from "@/components/landing/care";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Situations } from "@/components/landing/situations";
import { readSiteContent } from "@/lib/content-store";

export default async function HomePage() {
  await connection();
  const content = await readSiteContent();

  return (
    <>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:border focus:border-line focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-ink"
      >
        Ir para o conteúdo
      </a>
      <SiteHeader content={content} />
      <main>
        <Hero content={content} />
        <Situations content={content} />
        <About content={content} />
        <Care content={content} />
        <Faq content={content} />
        <FinalCta content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}
