import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Buttons } from '@/components/Button';

const sitemap = [
    {
        label: 'Home',
        href: '#home'
    },
    {
        label: 'About',
        href: '#about'
    },
    {
        label: 'Tech Stack',
        href: '#tools'
    },
    {
        label: 'Certificate',
        href: '#certificate'
    },
    {
        label: 'Contact me',
        href: '#contact'
    }
];

const Footer = ({ profile }) => {
    const githubUrl = profile?.github_url || 'https://github.com/ulhaqjackyhaw';
    const linkedinUrl = profile?.linkedin_url || 'https://www.linkedin.com/in/dhiyaulhaq100';
    const instagramUrl = profile?.instagram_url || 'https://www.instagram.com/dhy_lhq';
    const email = profile?.email || 'ulhaqjackyhaw@gmail.com';
    const fullName = profile?.full_name || 'Dhiya Ulhaq';

    const socials = [
        {
            label: 'GitHub',
            href: githubUrl
        },
        {
            label: 'LinkedIn',
            href: linkedinUrl
        },
        {
            label: 'Instagram',
            href: instagramUrl
        },
    ];

    return (
        <footer className="section" aria-label="Footer">
            <div className="container">
                <div className="lg:grid lg:grid-cols-2">
                    <div className="mb-10">
                        <h2 className="headline-2 mb-8 lg:max-w-[12ch] reveal-up">
                            Let&apos;s work <span className="headline-5">together today!</span>
                        </h2>
                        <Buttons 
                            href={`mailto:${email}`} 
                            label="Start project" 
                            icon={<ArrowForwardIcon />} 
                            classes="reveal-up" 
                            aria-label={`Kirim email ke ${email}`}
                            title={`Kirim email ke ${email}`}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:pl-20">
                        <div>
                            <p className="mb-2 font-medium text-white reveal-up">Sitemap</p>
                            <ul>
                                {sitemap.map(({ label, href }, key) => (
                                    <li key={key}>
                                        <a 
                                            href={href} 
                                            title={`Menuju ${label}`}
                                            className="block text-sm text-zinc-400 py-1 transition-colors hover:text-zinc-200"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="mb-2 font-medium text-white reveal-up">Socials</p>
                            <ul>
                                {socials.map(({ label, href }, key) => (
                                    <li key={key}>
                                        <a 
                                            href={href} 
                                            rel="noopener noreferrer" 
                                            target="_blank" 
                                            aria-label={`Kunjungi profil ${label} ${fullName}`}
                                            title={`Kunjungi ${label}`}
                                            className="block text-sm text-zinc-400 py-1 transition-colors hover:text-zinc-200 reveal-up"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-10 mb-8 border-t border-zinc-800/80">
                    <div className="w-16 h-16"></div>
                    <p className="text-zinc-400 text-sm reveal-up">
                        &copy; {new Date().getFullYear()} <span className="text-zinc-100 font-semibold">{fullName}</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
