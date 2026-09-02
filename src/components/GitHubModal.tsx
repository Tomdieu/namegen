import React, { useState } from 'react';
import { Github, Star, GitFork, Copy, Check, ExternalLink, Terminal, Heart, Code2 } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/Tomdieu/namegen';
  const cloneHttps = 'git clone https://github.com/Tomdieu/namegen.git';
  const cloneSsh = 'git clone git@github.com:Tomdieu/namegen.git';

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white border-3 border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0px_0px_#1A1A1A] p-6 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_0px_#FFD100]">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#1A1A1A]">Tomdieu / namegen</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#00E699] border border-[#1A1A1A] text-[#1A1A1A]">
                  Open Source
                </span>
              </div>
              <p className="text-xs text-[#4A4A4A]">26ⁿ Letter Combinatorics & Pronounceable Name Generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-[#1A1A1A] bg-[#FFF9E6] hover:bg-[#FF477E] hover:text-white font-black text-sm flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Quick Actions (Star, Fork, Visit) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs sm:text-sm text-[#1A1A1A] bg-[#FFD100] hover:bg-[#FFE04D] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-center"
          >
            <Star className="w-4 h-4 fill-[#1A1A1A] text-[#1A1A1A]" />
            <span>Star on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
          </a>

          <a
            href={`${repoUrl}/fork`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs sm:text-sm text-[#1A1A1A] bg-[#00D1FF] hover:bg-[#33DAFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-center"
          >
            <GitFork className="w-4 h-4 text-[#1A1A1A]" />
            <span>Fork Repository</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
          </a>
        </div>

        {/* Clone Commands */}
        <div className="space-y-3 bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-xl p-4 shadow-[2px_2px_0px_0px_#1A1A1A]">
          <div className="flex items-center gap-2 text-xs font-black text-[#1A1A1A]">
            <Terminal className="w-4 h-4 text-[#FF477E]" />
            <span>Clone Repository Locally</span>
          </div>

          {/* HTTPS Clone */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#4A4A4A]">
              <span>HTTPS:</span>
              <button
                onClick={() => copyToClipboard(cloneHttps, 'https')}
                className="inline-flex items-center gap-1 text-[#1A1A1A] hover:text-[#FF477E] transition-colors"
              >
                {copied === 'https' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'https' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-[#1A1A1A] text-white rounded-lg font-mono text-xs overflow-x-auto border border-[#1A1A1A] flex items-center justify-between gap-2">
              <span className="text-[#00E699] select-all truncate">{cloneHttps}</span>
            </div>
          </div>

          {/* SSH Clone */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#4A4A4A]">
              <span>SSH:</span>
              <button
                onClick={() => copyToClipboard(cloneSsh, 'ssh')}
                className="inline-flex items-center gap-1 text-[#1A1A1A] hover:text-[#FF477E] transition-colors"
              >
                {copied === 'ssh' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'ssh' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-[#1A1A1A] text-white rounded-lg font-mono text-xs overflow-x-auto border border-[#1A1A1A] flex items-center justify-between gap-2">
              <span className="text-[#FFD100] select-all truncate">{cloneSsh}</span>
            </div>
          </div>
        </div>

        {/* Quick run instructions */}
        <div className="bg-white border-2 border-[#1A1A1A] rounded-xl p-3.5 space-y-1.5 text-xs text-[#4A4A4A]">
          <div className="flex items-center gap-1.5 font-black text-[#1A1A1A]">
            <Code2 className="w-3.5 h-3.5 text-[#00D1FF]" />
            <span>Local Setup (3 steps)</span>
          </div>
          <p className="font-mono text-[11px] bg-[#FFF9E6] p-2 rounded border border-[#1A1A1A]/30 text-[#1A1A1A]">
            cd namegen && npm install && npm run dev
          </p>
        </div>

        {/* Direct Link Footer */}
        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#4A4A4A] border-t border-[#1A1A1A]/20">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-[#FF477E] fill-[#FF477E]" />
            Contributions & feedback welcome
          </span>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1A1A1A] hover:text-[#FF477E] underline flex items-center gap-1"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
