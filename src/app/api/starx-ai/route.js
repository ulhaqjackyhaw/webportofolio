import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `
Anda adalah "STAR-X AI", asisten representasi teknis dan profesional dari Dhiya Ulhaq.
Jawab pertanyaan pengunjung dengan gaya komunikasi profesional, padat, lugas, dan terstruktur. Hindari bahasa berlebihan, klise, atau penggunaan emoji yang berlebihan. Berikan fakta teknis yang akurat berdasarkan data profil berikut.

DATA PROFIL DHIYA ULHAQ:
- Nama: Dhiya Ulhaq
- Peran: Software Developer (Spesialisasi: Mobile Development, Web-Based Information Systems, IoT, dan AI/Data Analysis)
- Lokasi: Semarang, Indonesia
- Kontak:
  * Email: ulhaqjackyhaw@gmail.com
  * WhatsApp: 089524174285
  * LinkedIn: linkedin.com/in/dhiyaulhaq100
  * GitHub: github.com/ulhaqjackyhaw

PENDIDIKAN:
- Politeknik Negeri Semarang (Polines) — D3 Teknik Informatika (2023 - 2026)
- IPK: 3.91 / 4.00 (Cumlaude)
- Mata Kuliah Unggulan (Nilai A): Pemrograman Web, Pemrograman Mobile, Embedded System, Internet of Things, Keamanan Informasi, Desain Sistem Informasi, Sistem Basis Data.

PENGALAMAN KERJA & MAGANG:
1. Human Capital System Developer Intern — InJourney Airports Regional 1 (Okt – Des 2025):
   - Mengembangkan Human Capital Dashboard System untuk analitik data kepegawaian.
   - Membangun sistem manajemen magang berbasis web (Urshiports) untuk monitoring dan administrasi pemagang.
   - Mendukung screening kandidat rekrutmen pegawai dan analisis kualifikasi promosi karir.
2. Electronic Engineer Intern — Bandara Internasional Soekarno-Hatta (Agu – Sep 2025):
   - Pemeliharaan sistem elektronik bandara (Digital Banner, IPTV, Time Distribution System, Public Address, Fire Alarm System).
   - Instalasi sensor suhu Nohmi Fire Alarm System.
   - Mengembangkan web sistem arsip pajak (Buport) untuk Unit Pajak internal bandara.
3. Data Input Operator — Badan Pusat Statistik (Jan – Mar 2021):
   - Input, validasi, dan verifikasi konsistensi data statistik.

TECH STACK & KEAHLIAN:
- Bahasa Pemrograman: PHP, JavaScript, Python, Dart, C, C++, Java.
- Web & Frontend: Laravel, Next.js, React.js, Tailwind CSS, Bootstrap, HTML5, CSS3, jQuery.
- Mobile: Flutter, Dart, Android.
- Database: MySQL, PostgreSQL, Oracle SQL, Supabase, Prisma ORM.
- IoT & Hardware: ESP32, Arduino, Sensor Monitoring.
- AI & Data: Computer Vision, YOLO, Python (Flask), RAG (Retrieval-Augmented Generation).
- Tools: Git/GitHub, Vercel, Firebase, Figma, Canva.

PORTOFOLIO PROYEK UTAMA:
1. My Hiking App & Admin Web: Aplikasi mobile Flutter untuk booking pendakian gunung dan web admin manajemen sistem berbasis Laravel & REST API.
2. HRIS - CORE: Sistem kepegawaian komprehensif (absensi, rekrutmen, karir) berbasis Laravel & PostgreSQL.
3. Dashboard Kepegawaian Human Capital: Dashboard analitik data karyawan InJourney Airports Regional 1 (Laravel & Alpine.js).
4. Urshiports: Sistem manajemen magang terpadu InJourney Airports.
5. Buport (Sistem Arsip Pajak): Aplikasi web arsip bukti potong pajak vendor bandara.
6. Sistem Presensi Siswa (SISMO): Web presensi cerdas dengan deteksi wajah YOLO & Laravel.
7. Pill Inspector AI & MyHiking RAG AI: Solusi AI dengan Computer Vision dan RAG (Flask).
8. IoT Fire Detection Monitoring: Pendeteksi kebakaran dini berbasis hardware sensor dan mobile app.

SERTIFIKASI:
- BNSP: Certificate of Competence - Intermediate Multimedia Designer
- Kominfo VSGA: Intermediate Multimedia Designer
- AWS: Cloud & Gen AI di AWS
- MikroTik: MikroTik Certified Network Associate (MTCNA)
- CourseStack, Inc: Certified Cybersecurity Educator Professional (CCEP)
- Oracle Academy: Database Design & Database Programming with SQL
- Dicoding: Pemrograman JavaScript, Python, SQL
- Big Data: Certified Associate Big Data Analyst
- Bahasa: TOEIC (Score: 510) & TOEFL ITP

PANDUAN RESPON:
- Gunakan bahasa Indonesia yang profesional dan formal-santai (atau bahasa Inggris jika ditanya dalam bahasa Inggris).
- Format jawaban dengan ringkas, to-the-point, dan gunakan bullet points untuk daftar teknis.
- Hindari basa-basi yang panjang atau kesan robotik.
`;

function getSmartFallbackReply(userMessage) {
  const msg = (userMessage || '').toLowerCase();

  if (msg.includes('siapa') || msg.includes('who') || msg.includes('tentang') || msg.includes('profil') || msg.includes('profile')) {
    return `Dhiya Ulhaq adalah seorang Software Developer lulusan Teknik Informatika dari Politeknik Negeri Semarang dengan predikat Cumlaude (IPK 3.91).

Fokus Keahlian Utama:
• Mobile Development: Flutter, Dart, Android
• Web & Information Systems: Laravel, Next.js, React.js, Tailwind CSS
• Backend & Database: REST API, MySQL, PostgreSQL, Oracle SQL, Supabase
• IoT & AI: Hardware Sensor Monitoring (ESP32), Computer Vision (YOLO)

Pengalaman Kerja & Magang:
• InJourney Airports Regional 1 — Human Capital System Developer Intern
• Bandara Internasional Soekarno-Hatta — Electronic Engineer Intern
• Badan Pusat Statistik — Data Input Operator`;
  }

  if (msg.includes('pendidikan') || msg.includes('kuliah') || msg.includes('kampus') || msg.includes('polines') || msg.includes('ipk')) {
    return `Pendidikan Dhiya Ulhaq:

• Institusi: Politeknik Negeri Semarang (Polines)
• Program Studi: D3 Teknik Informatika (Associate Degree in Informatics Engineering)
• IPK: 3.91 / 4.00 (Cumlaude)
• Mata Kuliah Unggulan (Nilai A): Pemrograman Web, Pemrograman Mobile, Embedded System, Internet of Things, Keamanan Informasi, Desain Sistem Informasi, Sistem Basis Data.`;
  }

  if (msg.includes('pengalaman') || msg.includes('magang') || msg.includes('intern') || msg.includes('kerja') || msg.includes('injourney') || msg.includes('soekarno')) {
    return `Riwayat Pengalaman Kerja & Magang:

1. Human Capital System Developer Intern — InJourney Airports Regional 1 (Okt – Des 2025):
   • Membangun Human Capital Dashboard System untuk analitik data kepegawaian.
   • Mengembangkan Urshiports (web manajemen administrasi pemagang).
   • Mendukung screening kandidat rekrutmen dan analisis kualifikasi promosi pegawai.

2. Electronic Engineer Intern — Bandara Internasional Soekarno-Hatta (Agu – Sep 2025):
   • Pemeliharaan sistem elektronik bandara (Digital Banner, IPTV, Time Distribution System, Public Address, Fire Alarm System).
   • Instalasi sensor suhu Nohmi Fire Alarm System.
   • Membangun sistem arsip pajak berbasis web (Buport) untuk Unit Pajak internal bandara.

3. Data Input Operator — Badan Pusat Statistik (Jan – Mar 2021):
   • Input, validasi, dan verifikasi konsistensi data statistik.`;
  }

  if (msg.includes('skill') || msg.includes('keahlian') || msg.includes('stack') || msg.includes('bahasa') || msg.includes('tools')) {
    return `Tech Stack & Keahlian Utama Dhiya Ulhaq:

• Web & Frontend: Laravel, Next.js, React.js, Tailwind CSS, Bootstrap, HTML/CSS, JavaScript
• Mobile: Flutter, Dart, Android
• Backend & Database: PHP, Python (Flask), MySQL, PostgreSQL, Oracle SQL, Supabase, Prisma ORM
• IoT & AI: ESP32, Arduino, Sensor Monitoring, Computer Vision (YOLO), RAG
• Tools: Git/GitHub, Vercel, Firebase, Figma, Canva`;
  }

  if (msg.includes('proyek') || msg.includes('project') || msg.includes('porto') || msg.includes('hiking') || msg.includes('presensi') || msg.includes('hris')) {
    return `Portofolio Proyek Unggulan Dhiya Ulhaq:

1. My Hiking App & Web Admin: Aplikasi booking pendakian gunung berbasis Flutter + web backend manajemen sistem dengan Laravel & REST API.
2. HRIS - CORE: Sistem kepegawaian terpadu (presensi, rekrutmen, karir) berbasis Laravel & PostgreSQL.
3. Dashboard Kepegawaian Human Capital: Dashboard analitik data karyawan InJourney Airports Regional 1 (Laravel & Alpine.js).
4. Urshiports: Sistem manajemen & administrasi magang berbasis web di InJourney Airports.
5. Buport (Sistem Arsip Pajak): Aplikasi web arsip bukti potong pajak vendor bandara.
6. Sistem Presensi Siswa (SISMO): Web presensi cerdas dengan integrasi deteksi wajah YOLO.
7. Pill Inspector AI & MyHiking RAG AI: Sistem AI cerdas berbasis Computer Vision dan RAG (Flask).
8. Fire Detection Monitoring: Pendeteksi dini kebakaran berbasis IoT hardware sensor dan mobile app.`;
  }

  if (msg.includes('sertifikat') || msg.includes('certificate') || msg.includes('lisensi') || msg.includes('bnsp') || msg.includes('aws') || msg.includes('mtcna')) {
    return `Sertifikasi Resmi Dhiya Ulhaq:

• BNSP: Certificate of Competence - Intermediate Multimedia Designer
• Kominfo VSGA: Intermediate Multimedia Designer
• AWS: Cloud & Gen AI di AWS
• MikroTik: MikroTik Certified Network Associate (MTCNA)
• CourseStack, Inc: Certified Cybersecurity Educator Professional (CCEP)
• Oracle Academy: Database Design & Database Programming with SQL
• Dicoding: Pemrograman JavaScript, Python, dan SQL
• Big Data: Certified Associate Big Data Analyst
• Bahasa: TOEIC (Score: 510) & TOEFL ITP`;
  }

  if (msg.includes('kontak') || msg.includes('contact') || msg.includes('email') || msg.includes('wa') || msg.includes('hire') || msg.includes('hubungi') || msg.includes('telepon')) {
    return `Kontak Dhiya Ulhaq:

• WhatsApp: 089524174285 (https://wa.me/6289524174285)
• Email: ulhaqjackyhaw@gmail.com
• LinkedIn: https://www.linkedin.com/in/dhiyaulhaq100
• GitHub: https://github.com/ulhaqjackyhaw
• Lokasi: Semarang, Indonesia

Terbuka untuk peluang kerja Full-Time, Internship, maupun proyek freelance kolaboratif.`;
  }

  return `Saya adalah STAR-X, asisten representasi teknis Dhiya Ulhaq. 

Anda dapat menanyakan informasi seputar:
• Profil & Pendidikan (Polines, IPK 3.91 Cumlaude)
• Pengalaman Kerja (InJourney Airports & Bandara Soekarno-Hatta)
• Keahlian & Tech Stack (Flutter, Laravel, Next.js, IoT, AI)
• Portofolio Proyek (My Hiking, HRIS, Dashboard Kepegawaian, dll.)
• Sertifikasi Resmi (BNSP, AWS, MikroTik, Oracle, Dicoding)
• Kontak Langsung (Email & WhatsApp)`;
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

    // 1. Opsi Gemini API
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
                temperature: 0.5,
                maxOutputTokens: 900,
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
          temperature: 0.5,
          max_tokens: 900,
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
            temperature: 0.5,
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

    // 4. Fallback Cerdas
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
        content: 'Terjadi kendala teknis saat memproses pesan. Silakan hubungi Dhiya Ulhaq langsung via email: ulhaqjackyhaw@gmail.com.',
      },
      { status: 200 }
    );
  }
}
