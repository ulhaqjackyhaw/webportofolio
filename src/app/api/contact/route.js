import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Nama, email, dan pesan wajib diisi.' },
        { status: 400 }
      );
    }

    const targetEmail = process.env.CONTACT_EMAIL || 'ulhaqjackyhaw@gmail.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dhiyaulhaq.web.id/';

    // Kirim pesan melalui FormSubmit AJAX endpoint
    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': siteUrl,
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Pesan Portofolio Baru dari ${name}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const data = await response.json();

    // Jika form belum diaktivasi pertama kali
    if (data.message && data.message.includes('needs Activation')) {
      return NextResponse.json({
        success: true,
        needsActivation: true,
        message: 'Pesan berhasil diproses! (Cek email ulhaqjackyhaw@gmail.com untuk klik konfirmasi aktivasi form 1x).',
      });
    }

    if (!response.ok && data.success === 'false') {
      return NextResponse.json(
        { success: false, message: data.message || 'Gagal mengirim pesan.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan Anda berhasil dikirim ke email saya! Terima kasih telah menghubungi.',
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server saat mengirim email.' },
      { status: 500 }
    );
  }
}
