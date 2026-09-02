import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className="flex items-center gap-3">
      {/* Visual Logo Mark */}
      <div
        className={`${iconDimensions} relative rounded-xl bg-[#FF477E] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center justify-center overflow-hidden transition-transform hover:-rotate-3`}
      >
        {/* Geometric Accent Line */}
        <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#FFD100] border-2 border-[#1A1A1A] rounded-full rotate-12" />
        
        {/* Central Monogram */}
        <div className="relative z-10 flex items-center justify-center">
          <span className="font-mono font-black text-white text-base sm:text-lg tracking-tighter drop-shadow-[1px_1px_0px_#1A1A1A]">
            26ⁿ
          </span>
        </div>

        {/* Small Bottom Corner Accent */}
        <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-[#00D1FF] border border-[#1A1A1A] rounded-sm" />
      </div>

      {/* Brand Text */}
      {showText && (
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
              NameGen
            </span>
            <span className="text-xs font-medium text-[#4A4A4A]">
              by{' '}
              <a
                href="https://ivantomdieu.vercel.app/en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A1A1A] font-extrabold hover:text-[#FF477E] underline decoration-2 underline-offset-2 transition-colors inline-block"
                title="Tomdieu ivan portfolio"
              >
                Tomdieu ivan
              </a>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border-2 border-[#1A1A1A] bg-[#FFD100] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]">
              26ⁿ Engine
            </span>
          </div>
          <p className="text-xs font-medium text-[#4A4A4A] line-clamp-1">
            Combinatoric Letter Permutations & Phonetic Name Generator
          </p>
        </div>
      )}
    </div>
  );
};
