"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "../data/faq";
import { faqSchema } from "../data/json-ld";
import { studioEase } from "../lib/motion";

interface FaqAccordionProps {
  visible: boolean;
}

/**
 * FaqAccordion — a list of common client questions.
 *
 * Uses the shadcn/ui Accordion (Radix) for accessible expand/collapse.
 * Renders on the studio view below the metrics to answer the most
 * common pre-inquiry questions and reduce friction. Injects `FAQPage`
 * JSON-LD structured data for rich results in search.
 */
export function FaqAccordion({ visible }: FaqAccordionProps) {
  return (
    <div>
      {/* FAQPage structured data for SEO rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <motion.div
        className="mb-4 flex items-baseline gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: studioEase, delay: 0.4 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          FAQ
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </motion.div>

      <Accordion
        type="single"
        collapsible
        defaultValue={faqItems[0]?.id}
        className="space-y-2"
      >
        {faqItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.5,
              ease: studioEase,
              delay: 0.5 + i * 0.08,
            }}
          >
            <AccordionItem
              value={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm data-[state=open]:bg-white/10"
            >
              <AccordionTrigger className="px-5 py-4 text-left hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-th-blue-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base text-white md:text-lg">
                    {item.question}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 pt-0">
                <p className="ml-7 text-sm leading-relaxed text-white/70">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
}
