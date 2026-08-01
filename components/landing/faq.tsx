"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

interface FaqProps {
  content: SiteContent;
}

export function Faq({ content }: FaqProps) {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { faq } = content;

  return (
    <section
      id="duvidas"
      className="relative bg-canvas px-5 py-20 sm:px-8 sm:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <motion.h2
          id="faq-heading"
          className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          {faq.heading}
        </motion.h2>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={`${item.question}-${index}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-display text-lg font-medium text-ink sm:text-xl">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-base leading-relaxed text-muted">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
