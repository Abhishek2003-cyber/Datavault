"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "What can I do with Datavault?",
    answer: "Datavault allows you to securely upload, encrypt, store, manage, and monetize datasets through a single platform."
  },
  {
    question: "What is the difference between Marketplace and Private Vault?",
    answer: "Marketplace datasets can be listed for sale and licensed to buyers. Private Vault datasets remain private and accessible only to the owner."
  },
  {
    question: "How do I upload a dataset?",
    answer: "Navigate to the Upload page, enter dataset details, select a category, upload your file, and choose whether to store it privately or publish it to the marketplace."
  },
  {
    question: "What file formats are supported?",
    answer: "CSV, PDF, TXT, JSON, PNG, JPG, and JPEG files are supported. Maximum file size is 1GB."
  },
  {
    question: "Can I upload a dataset without selling it?",
    answer: "Yes. You can securely store datasets in your Private Vault without listing them publicly."
  },
  {
    question: "What happens after I upload a dataset?",
    answer: "Your dataset is processed, encrypted, secured, and registered before appearing in your vault or marketplace listing."
  },
  {
    question: "How do buyers access purchased datasets?",
    answer: "Buyers receive access only after successful authorization and validation."
  },
  {
    question: "How do renewals work?",
    answer: "Private Vault datasets may require renewal depending on the selected storage plan. Renewal status is visible inside the dashboard."
  },
  {
    question: "How can I view my uploaded datasets?",
    answer: "All uploaded datasets can be managed from the Dashboard section."
  },
  {
    question: "Is a wallet required?",
    answer: "Yes. Wallet connection is required for ownership verification, secure access management, and platform functionality."
  },
  {
    question: "Who is Datavault built for?",
    answer: "Datavault is designed for AI researchers, data scientists, startups, enterprises, and dataset creators who require secure dataset management."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-10 mx-auto w-full max-w-[800px] py-32 px-4 md:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="font-[Playfair_Display] font-bold text-4xl md:text-5xl text-ink-900 mb-6">
          Frequently Asked Questions
        </h2>
        <p className="font-[Jost] text-ink-500 text-lg max-w-xl mx-auto leading-relaxed">
          Everything you need to know about Datavault, encrypted datasets, and secure storage.
        </p>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div 
              key={index}
              className={`border transition-colors duration-300 bg-ivory-50/40 backdrop-blur-sm ${isOpen ? 'border-copper-500 shadow-[0_0_15px_rgba(212,169,122,0.1)]' : 'border-ivory-300 hover:border-copper-300 hover:bg-ivory-50'}`}
              initial={false}
              animate={{ backgroundColor: isOpen ? 'rgba(253, 250, 244, 0.8)' : 'rgba(253, 250, 244, 0.4)' }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
              >
                <span className="font-[Jost] font-medium text-lg text-ink-900 pr-8">
                  {faq.question}
                </span>
                <span className={`flex-shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180 text-copper-500' : 'text-ink-300'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-ivory-200 mx-6">
                      <p className="font-[Jost] font-light text-ink-500 leading-relaxed text-[15px]">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
