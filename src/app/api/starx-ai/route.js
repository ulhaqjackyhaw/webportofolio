import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `
Anda adalah "STAR-X AI", Asisten Virtual Pribadi resmi dari Dhiya Ulhaq.
Tugas Anda adalah menyapa pengunjung, menjawab pertanyaan tentang Dhiya Ulhaq (profil, keahlian, tech stack, portofolio proyek, sertifikat, dan kontak), serta membantu recruiter atau calon klien mengenal Ulhaq lebih dekat.

Data Profil Dhiya Ulhaq:
- Nama Lengkap: Dhiya Ulhaq
- Gelar/Peran: Software Developer (Fokus: Mobile App, Web Development, IoT & AI)
- Pendidikan: Mahasiswa Teknik Informatika (Informatics Engineering) di Politeknik Negeri Semarang (Polines).
- Status: Tersedia untuk peluang kerja Full-time, Internship/Magang, dan Proyek Kolaborasi / Freelance.
- Keahlian Utama:
  * Mobile Development: Flutter, Android (Java/Kotlin), Dart, State Management, Integrasi REST API.
  * Web & Frontend: Next.js, React.js, Tailwind CSS, JavaScript (ES6+), HTML5, CSS3, Bootstrap.
  * Backend & Database: PHP, Laravel, Node.js, Python, Flask, PostgreSQL, MySQL, Supabase, Prisma ORM.
  * Cloud & BaaS: Supabase, Firebase, Vercel, AWS Cloud & Gen AI.
  * IoT & Hardware: Arduino, ESP32, Sensor Monitoring, Microcontroller.
  * AI & Machine Learning: Python, Computer Vision, YOLO, Integrasi Generative AI.
  * UI/UX Tools: Figma, Canva.
- Proyek Unggulan (Portfolio Highlights):
  1. My Hiking App & Web Admin: Aplikasi mobile Flutter pemesanan/booking tiket pendakian gunung dan web admin manajemen pendaki dengan REST API.
  2. Pill Inspector AI: Sistem deteksi dan klasifikasi pil/obat otomatis berbasis Computer Vision dan Flask API.
  3. Fire Detection Monitoring: Sistem IoT deteksi kebakaran dini berbasis sensor hardware, aplikasi mobile, dan notifikasi real-time.
  4. Sistem Presensi Siswa: Sistem absensi siswa cerdas dengan deteksi wajah YOLO dan framework Laravel.
- Sertifikasi:
  1. Cloud & Gen AI di AWS
  2. Pemrograman JavaScript
  3. Database Design
  4. Database Pemrograman with SQL
- Kontak & Sosial:
  * Email: ulhaqjackyhaw@gmail.com
  * LinkedIn: https://www.linkedin.com/in/dhiyaulhaq100
  * GitHub: https://github.com/ulhaqjackyhaw
  * Instagram: @dhy_lhq

Panduan Respon:
1. Bersikaplah ramah, profesional, antusias, dan sopan seperti representasi resmi Dhiya Ulhaq.
2. Jawab pertanyaan dalam bahasa yang digunakan oleh pengunjung (Bahasa Indonesia atau Bahasa Inggris).
3. Buat jawaban yang ringkas, jelas, dan terstruktur (gunakan bullet points jika menyajikan daftar keahlian/proyek).
4. Jika ada pengunjung yang tertarik merekrut atau mengajak kolaborasi, berikan email kontak (ulhaqjackyhaw@gmail.com) atau arahkan ke LinkedIn.
5. Jika ditanya hal di luar Dhiya Ulhaq atau hal teknologi yang tidak relevan, jawab dengan sopan dan kembalikan fokus ke profil Dhiya Ulhaq.
`;

// Fallback cerdas jika belum ada API key yang dipasang di environment
function getSmartFallbackReply(userMessage) {
  const msg = (userMessage || '').toLowerCase();

  if (msg.includes('siapa') || msg.includes('who') || msg.includes('tentang') || msg.includes('profil') || msg.includes('profile')) {
    return `👋 Halo! Dhiya Ulhaq adalah seorang **Software Developer** dan mahasiswa Teknik Informatika di Politeknik Negeri Semarang (Polines). 

Beliau memiliki fokus utama pada pengembangan **Mobile Apps (Flutter/Android)**, **Web Development (Next.js/React/Laravel)**, serta memiliki ketertarikan kuat pada **IoT dan Artificial Intelligence**. Saat ini beliau terbuka untuk peluang magang, full-time, maupun proyek freelance!`;
  }

  if (msg.includes('skill') || msg.includes('keahlian') || msg.includes('stack') || msg.includes('bahasa') || msg.includes('tools')) {
    return `💻 Berikut adalah Tech Stack utama yang dikuasai oleh Dhiya Ulhaq:

• **Mobile**: Flutter, Dart, Android (Java)
• **Frontend & Web**: Next.js, React.js, Tailwind CSS, JavaScript, HTML/CSS
• **Backend & DB**: Laravel, PHP, Python (Flask), PostgreSQL, MySQL, Supabase, Prisma ORM
• **IoT & AI**: ESP32/Arduino sensor monitoring, Machine Learning (YOLO, Computer Vision)
• **Cloud & Tools**: Vercel, Firebase, Git/GitHub, Figma`;
  }

  if (msg.includes('proyek') || msg.includes('project') || msg.includes('porto') || msg.includes('karya') || msg.includes('hiking') || msg.includes('pill')) {
    return `🚀 Beberapa proyek unggulan yang pernah dibangun oleh Dhiya Ulhaq antara lain:

1. **My Hiking App & Web Admin**: Aplikasi mobile Flutter untuk booking pendakian gunung yang terintegrasi dengan REST API web backend admin.
2. **Pill Inspector AI**: Sistem pendeteksi dan klasifikasi pil otomatis menggunakan Flask dan Computer Vision.
3. **Fire Detection Monitoring**: Sistem pendeteksi dini kebakaran berbasis IoT hardware dan mobile app.
4. **Sistem Presensi Siswa**: Aplikasi web presensi pintar menggunakan Laravel dan deteksi wajah YOLO.`;
  }

  if (msg.includes('sertifikat') || msg.includes('certificate') || msg.includes('lisensi')) {
    return `📜 Dhiya Ulhaq memiliki sejumlah sertifikasi kredensial resmi, di antaranya:
• Cloud & Gen AI di AWS
• Pemrograman JavaScript
• Database Design
• Database Pemrograman with SQL`;
  }

  if (msg.includes('kontak') || msg.includes('contact') || msg.includes('email') || msg.includes('hire') || msg.includes('kerja') || msg.includes('hubungi') || msg.includes('linkedin')) {
    return `📬 Anda dapat menghubungi Dhiya Ulhaq secara langsung melalui:
• **Email**: [ulhaqjackyhaw@gmail.com](mailto:ulhaqjackyhaw@gmail.com)
• **LinkedIn**: [linkedin.com/in/dhiyaulhaq100](https://www.linkedin.com/in/dhiyaulhaq100)
• **GitHub**: [github.com/ulhaqjackyhaw](https://github.com/ulhaqjackyhaw)
• **Instagram**: [@dhy_lhq](https://www.instagram.com/dhy_lhq)

Beliau selalu antusias untuk mendiskusikan peluang kolaborasi baru!`;
  }

  return `Halo! Saya **STAR-X AI**, asisten virtual Dhiya Ulhaq. 

Ada yang bisa saya bantu terkait profil, keahlian tech stack, portofolio proyek, atau kontak kolaborasi dengan Dhiya Ulhaq? Silakan pilih topik yang ingin Anda ketahui!`;
}

export async function POST(request) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. Opsi Gemini API (Sangat cepat & gratis)
    if (geminiKey) {
      try {
        const contents = [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_PROMPT}\n\nPertanyaan Pengunjung: ${message}` }],
          },
        ];

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        const geminiData = await geminiRes.json();
        const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (replyText) {
          return NextResponse.json({
            role: 'starx-ai',
            content: replyText,
            engine: 'gemini',
          });
        }
      } catch (geminiErr) {
        console.error('Gemini API error, falling back:', geminiErr);
      }
    }

    // 2. Opsi OpenAI API
    if (openaiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-6).map((h) => ({
            role: h.role === 'starx-ai' ? 'assistant' : 'user',
            content: h.content || h.input || '',
          })),
          { role: 'user', content: message },
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 800,
        });

        const replyText = completion.choices[0]?.message?.content;
        if (replyText) {
          return NextResponse.json({
            role: 'starx-ai',
            content: replyText,
            engine: 'openai',
          });
        }
      } catch (openaiErr) {
        console.error('OpenAI API error, falling back:', openaiErr);
      }
    }

    // 3. Opsi Groq API
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: message },
            ],
            temperature: 0.7,
          }),
        });

        const groqData = await groqRes.json();
        const replyText = groqData.choices?.[0]?.message?.content;
        if (replyText) {
          return NextResponse.json({
            role: 'starx-ai',
            content: replyText,
            engine: 'groq',
          });
        }
      } catch (groqErr) {
        console.error('Groq API error, falling back:', groqErr);
      }
    }

    // 4. Default: Respon Berbasis Pengetahuan Cerdas (Tanpa Error 500)
    const fallbackResponse = getSmartFallbackReply(message);
    return NextResponse.json({
      role: 'starx-ai',
      content: fallbackResponse,
      engine: 'knowledge-base',
    });
  } catch (error) {
    console.error('STAR-X AI server error:', error);
    return NextResponse.json(
      {
        role: 'starx-ai',
        content: 'Maaf, terjadi kesalahan teknis pada sistem AI. Silakan tanyakan hal lain atau hubungi Dhiya Ulhaq langsung via email.',
      },
      { status: 200 }
    );
  }
}

