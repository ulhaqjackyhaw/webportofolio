"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const QUICK_PROMPTS = [
  "👋 Siapa itu Dhiya Ulhaq?",
  "💻 Apa saja tech stack & skill utamanya?",
  "🚀 Ceritakan tentang proyek My Hiking",
  "📱 Pengalaman di Mobile Development & IoT?",
  "📬 Bagaimana cara mengontak Ulhaq untuk kerja sama?",
];

const INITIAL_MESSAGES = [
  {
    role: 'starx-ai',
    content: `Halo! 👋 Saya **STAR-X AI**, asisten virtual pribadi **Dhiya Ulhaq**.\n\nSaya bisa membantu Anda mengetahui lebih banyak tentang keahlian software development, proyek portofolio, latar belakang pendidikan, hingga kontak kolaborasi dengan Dhiya Ulhaq.\n\nAda yang ingin Anda tanyakan? Anda juga bisa memilih saran pertanyaan di bawah!`,
  },
];

const ChatClient = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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
          { role: 'starx-ai', content: data.content, engine: data.engine },
        ]);
      } else {
        throw new Error('Tidak ada respon.');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'starx-ai',
          content: 'Maaf, terjadi kendala saat menghubungkan ke sistem AI. Anda bisa menghubungi Dhiya Ulhaq secara langsung melalui email: ulhaqjackyhaw@gmail.com.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format teks sederhana (bold, list, bullet points)
  const formatContent = (content) => {
    return content.split('\n').map((line, idx) => {
      // Bold formatter
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} className="block min-h-[1.25rem]">
          {parts}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Header Bar */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-900/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 transition-all border border-zinc-700/40"
            title="Kembali ke Beranda Portofolio"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Portofolio</span>
          </Link>
          <div className="h-5 w-[1px] bg-zinc-800 hidden sm:block"></div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 grid place-items-center text-white shadow-lg shadow-sky-500/20">
              <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">STAR-X AI</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30">
                  Virtual Copilot
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Representasi Asisten Dhiya Ulhaq
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/#contact"
          className="text-xs sm:text-sm px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-sm"
        >
          Hubungi Ulhaq
        </Link>
      </header>

      {/* Chat Messages Body */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 sm:gap-4 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role !== 'user' && (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 grid place-items-center text-white shrink-0 shadow-md shadow-sky-500/20">
                <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[75%] text-sm sm:text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-600/20'
                  : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-tl-sm shadow-lg'
              }`}
            >
              <div className="space-y-1">
                {formatContent(msg.content)}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/60 grid place-items-center text-zinc-300 shrink-0">
                <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 grid place-items-center text-white shrink-0">
              <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-sm bg-zinc-900/90 border border-zinc-800 text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-zinc-400 ml-1">STAR-X AI sedang berpikir...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Suggested Quick Prompts */}
      <div className="px-4 sm:px-6 py-2 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-sm max-w-4xl w-full mx-auto">
        <p className="text-[11px] text-zinc-500 mb-2 font-medium">Saran topik pertanyaan:</p>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-xs bg-zinc-900 hover:bg-zinc-800 hover:text-sky-300 border border-zinc-800 hover:border-sky-500/40 text-zinc-300 px-3 py-1.5 rounded-full shrink-0 transition-all cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field Section */}
      <footer className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md max-w-4xl w-full mx-auto shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            ref={textareaRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan untuk STAR-X AI... (tekan Enter)"
            disabled={isLoading}
            className="w-full bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-500 text-sm sm:text-base rounded-xl py-3.5 pl-4 pr-14 border border-zinc-700/60 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Kirim pesan"
            className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white disabled:text-zinc-500 transition-all shadow-sm flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <SendRoundedIcon sx={{ fontSize: 20 }} />
          </button>
        </form>
        <p className="text-center text-[11px] text-zinc-500 mt-2">
          STAR-X AI adalah asisten virtual interaktif untuk portofolio Dhiya Ulhaq.
        </p>
      </footer>
    </div>
  );
};

export default ChatClient;
