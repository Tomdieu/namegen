import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const SEOSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the 26ⁿ letter combination generator work?',
      a: 'The English alphabet contains 26 unique characters (A–Z). For any word of length N, the theoretical number of combinations is 26 raised to the power of N (26ⁿ). For example, a 9-letter word has 26⁹ = 5,429,503,678,976 (over 5.4 trillion) possible variations. NameGen calculates this exact permutation space and applies linguistic heuristics to discover melodic, pronounceable names.'
    },
    {
      q: 'How does NameGen turn random letter combinations into pronounceable words?',
      a: 'Pure random permutations contain unpronounceable consonant clusters (e.g., "xrkzt"). NameGen employs phonotactic transition probability models, vowel-to-consonant balancing algorithms, and morpheme blending to ensure generated names have a natural lyrical flow and high pronounceability score.'
    },
    {
      q: 'Can I lock specific vowels, consonants, or fixed letters at chosen positions?',
      a: 'Yes! The Positional Slot Matrix allows you to configure rules for every individual letter index (Position 1 through N). You can lock exact characters (e.g., starting with "V"), restrict positions to vowels (A, E, I, O, U, Y) or consonants, and use 1-click rhythm presets like C-V-C-V alternating cadence.'
    },
    {
      q: 'What is the Acrostic Name Meaning feature?',
      a: 'Every generated name can be inspected to reveal an acrostic virtue profile where each letter represents an inspiring trait or virtue (e.g., V = Visionary, A = Authentic, L = Luminous). You can click any individual letter in the inspector modal to regenerate alternate virtues.'
    },
    {
      q: 'Is NameGen free to use for startups, branding, and domain name discovery?',
      a: 'Yes, 100% free with no registration required. All generated combinations can be copied, saved to your favorites drawer, and exported as CSV or TXT files for your domain checks, trademark searches, and creative projects.'
    }
  ];

  return (
    <section className="mt-12 bg-white border-2 border-[#1A1A1A] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1A1A1A] space-y-8">
      {/* Editorial SEO Header */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-[#FFD100] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
          <BookOpen className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span>Combinatorics & Linguistic Guide</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
          How to Generate Unique, Pronounceable Names from 26 Alphabet Permutations
        </h2>
        <p className="text-sm text-[#4A4A4A] leading-relaxed max-w-3xl">
          Finding an untaken brand name, startup moniker, domain handle, or character pseudonym is increasingly difficult. 
          <strong> NameGen</strong> solves this by synthesizing exponential <strong>26ⁿ combinatorics</strong> with 
          real-time <strong>phonotactic flow algorithms</strong>.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-xl p-4 shadow-[2px_2px_0px_0px_#1A1A1A] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF477E] border-2 border-[#1A1A1A] flex items-center justify-center shadow-[1px_1px_0px_0px_#1A1A1A]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-black text-[#1A1A1A]">Exponential 26ⁿ Permutations</h3>
          <p className="text-xs text-[#4A4A4A] leading-relaxed">
            Calculates exact theoretical probability spaces from 26 letters ($26^N$) and measures information entropy in bits.
          </p>
        </div>

        <div className="bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-xl p-4 shadow-[2px_2px_0px_0px_#1A1A1A] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#00D1FF] border-2 border-[#1A1A1A] flex items-center justify-center shadow-[1px_1px_0px_0px_#1A1A1A]">
            <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <h3 className="text-sm font-black text-[#1A1A1A]">Phonetic Transition Scoring</h3>
          <p className="text-xs text-[#4A4A4A] leading-relaxed">
            Eliminates awkward letter clusters and balances vowel-consonant ratios to guarantee organic pronounceability.
          </p>
        </div>

        <div className="bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-xl p-4 shadow-[2px_2px_0px_0px_#1A1A1A] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#00E699] border-2 border-[#1A1A1A] flex items-center justify-center shadow-[1px_1px_0px_0px_#1A1A1A]">
            <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <h3 className="text-sm font-black text-[#1A1A1A]">Positional Slot Matrix</h3>
          <p className="text-xs text-[#4A4A4A] leading-relaxed">
            Lock specific characters, define vowel/consonant constraints per index, and test rhythm patterns effortlessly.
          </p>
        </div>
      </div>

      {/* Open Source & GitHub Banner */}
      <div className="bg-[#1A1A1A] text-white rounded-xl p-5 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#FFD100] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-base font-black text-[#FFD100]">⭐ Open Source on GitHub</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF477E] text-white">MIT</span>
          </div>
          <p className="text-xs text-[#E0E0E0] max-w-xl">
            NameGen is fully open-source at <strong>github.com/Tomdieu/namegen</strong>. Star the repository, report feature ideas, or clone the project locally to build your own word engines.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/Tomdieu/namegen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black text-[#1A1A1A] bg-[#FFD100] hover:bg-[#FFE04D] border-2 border-[#FFD100] shadow-[2px_2px_0px_0px_#00D1FF] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <span>Star on GitHub</span>
            <span>⭐</span>
          </a>
          <a
            href="https://github.com/Tomdieu/namegen/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black text-white bg-[#333333] hover:bg-[#444444] border-2 border-white/20 transition-colors"
          >
            <span>Fork</span>
          </a>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) with Accordion */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-black text-[#1A1A1A] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#FF477E]" />
          Frequently Asked Questions (FAQ)
        </h3>
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border-2 border-[#1A1A1A] rounded-xl overflow-hidden bg-[#FFF9E6] shadow-[2px_2px_0px_0px_#1A1A1A]"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-3.5 flex items-center justify-between font-bold text-xs sm:text-sm text-[#1A1A1A] hover:bg-[#FFD100]/20 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-[#1A1A1A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-[#1A1A1A]" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-[#4A4A4A] leading-relaxed border-t border-[#1A1A1A]/20 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
