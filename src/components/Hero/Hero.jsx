import React from 'react';
import Image from 'next/image';
import bannerImg from "@/assets/images/Ulhaq.png";
import DownloadSharpIcon from '@mui/icons-material/DownloadSharp';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Buttons, ButtonExtend } from '../Button';

const Hero = ({ profile }) => {
    const fullName = profile?.full_name || 'Dhiya Ulhaq';
    const title = profile?.title || 'Software Developer';
    const statusText = profile?.status_text || 'Available for work';
    const avatarUrl = profile?.avatar_url || bannerImg;
    const cvUrl = profile?.cv_url || "https://drive.google.com/file/d/1UScmjE3fVCfuYrAn2zqOCuxV65H-qsMx/view?usp=drive_link";
    const connectUrl = profile?.linkedin_url || "https://www.linkedin.com/in/dhiyaulhaq100";

    return (
        <section id="home" className="pt-28 lg:pt-36">
            <div className="container lg:grid lg:grid-cols-2 items-center lg:gap-10">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm tracking-wide ">
                            <span className="relative w-2 h-2 rounded-full bg-emerald-400">
                                <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            </span>
                            {statusText}
                        </div>
                    </div>
                    <h2 className="font-sans headline-1">
                        Hello, My Name <span className="headline-3 font-sans">is {fullName},</span> I&apos;am a <span className="headline-4 font-sans">{title}</span>
                    </h2>
                    <div className="flex items-center gap-3 ">
                        <Buttons href={cvUrl} download={true} label="Download CV" icon={<DownloadSharpIcon />} />
                        <ButtonExtend href={connectUrl} target="_blank" label="Connect to Me" icon={<ArrowOutwardIcon />} />
                    </div>
                </div>
                <div>
                    <figure className="w-full max-w-[480px] ml-auto bg-gradient-to-t from-sky-400 via-25% via-sky-400/40 to-65% rounded-[60px] overflow-hidden">
                        <Image
                            src={avatarUrl}
                            width={typeof avatarUrl === 'string' ? 480 : undefined}
                            height={typeof avatarUrl === 'string' ? 480 : undefined}
                            priority
                            fetchPriority="high"
                            quality={75}
                            alt="banner"
                            className="w-full h-auto object-cover"
                        />
                    </figure>
                </div>
            </div>
        </section>
    );
}

export default Hero;
