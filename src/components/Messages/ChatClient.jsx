"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

const QUICK_PROMPTS = [
  "Profil Dhiya Ulhaq",
  "Pendidikan & IPK",
  "Pengalaman InJourney & Bandara Soetta",
  "Tech Stack & Keahlian",
  "Portofolio Proyek Utama",
  "Sertifikasi Resmi",
  "Kontak & WhatsApp",
];

const INITIAL_MESSAGES = [
  {
    role: 'starx-ai',
    content: `Halo, saya **STAR-X**, asisten representasi teknis dari **Dhiya Ulhaq**.\n\nSaya dapat memberikan informasi mengenai latar belakang pendidikan, pengalaman kerja magang, tech stack, portofolio proyek, hingga kontak kolaborasi.\n\nSilakan ajukan pertanyaan atau pilih topik di bawah ini.`,
  },
];

const ChatClient = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/starx-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages.slice(-6),
        }),
      });

      const data = await response.json();

      if (data?.content) {
        setMessages((prev) => [
          ...prev,
          { role: 'starx-ai', content: data.content },
        ]);
      } else {
        throw new Error('Tidak ada respon.');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'starx-ai',
          content: 'Terjadi kendala jaringan saat menghubungkan ke sistem. Silakan hubungi Dhiya Ulhaq langsung via email: ulhaqjackyhaw@gmail.com.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} className="block min-h-[1.2rem]">
          {parts}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Top Header Bar - Fully Responsive on Mobile */}
      <header className="h-14 sm:h-16 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800 flex items-center gap-1 shrink-0"
            aria-label="Kembali ke Portofolio"
            title="Kembali ke Portofolio"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline text-xs sm:text-sm font-medium">Portofolio</span>
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 grid place-items-center text-sky-400 shrink-0">
              <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-semibold text-white tracking-tight truncate">STAR-X AI</h1>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
                AI Assistant Dhiya Ulhaq
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/#contact"
          className="text-xs px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-medium transition-colors shrink-0 whitespace-nowrap ml-2"
        >
          Kontak
        </Link>
      </header>

      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 sm:gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role !== 'user' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 grid place-items-center text-sky-400 shrink-0 mt-0.5">
                <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
              </div>
            )}

            <div
              className={`p-3.5 sm:p-4 rounded-2xl max-w-[88%] sm:max-w-[80%] text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-xs'
                  : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800/80 rounded-tl-xs shadow-sm'
              }`}
            >
              <div className="space-y-1">
                {formatContent(msg.content)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 grid place-items-center text-sky-400 shrink-0 mt-0.5">
              <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-zinc-900/90 border border-zinc-800/80 text-zinc-400 flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-zinc-400">Sedang memproses jawaban...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Suggested Topic Chips */}
      <div className="px-3 sm:px-6 py-2 border-t border-zinc-900 bg-zinc-950 max-w-3xl w-full mx-auto shrink-0">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[11px] sm:text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-md px-2.5 py-1 shrink-0 transition-colors cursor-pointer disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box Footer */}
      <footer className="p-3 sm:p-4 border-t border-zinc-800/80 bg-zinc-950 max-w-3xl w-full mx-auto shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan tentang Dhiya Ulhaq... (Enter)"
            disabled={isLoading}
            className="w-full bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-12 border border-zinc-800 focus:border-sky-500 focus:outline-none transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Kirim"
            className="absolute right-1.5 p-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 text-white disabled:text-zinc-600 transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <SendRoundedIcon sx={{ fontSize: 16 }} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatClient;
