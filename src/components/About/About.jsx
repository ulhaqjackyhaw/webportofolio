import React from 'react';

const defaultAbout = '👋 Hello!, I am Dhiya Ulhaq, Third-year Informatics Engineering student at Politeknik Negeri Semarang with a strong focus on mobile development, IoT, and web development. Possesses a passion for innovation and a proven track record in developing successful mobile app, web projects, and IoT. Actively involved in project base learning, demonstrating strong problem-solving skills, teamwork, adaptability, and a continuous learning mindset.';

const About = ({ profile }) => {
    const aboutText = profile?.about_text || defaultAbout;

    return (
        <section id="about" className="section" aria-labelledby="about-heading">
            <div className="container">
                <h2 id="about-heading" className="headline-2 mb-6 sm:mb-8 reveal-up">
                    About <span className="headline-5">Me</span>
                </h2>
                <div className="bg-zinc-800/50 p-6 sm:p-8 md:p-12 rounded-2xl border border-zinc-700/30 reveal-up">
                    <p className="text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose w-full text-justify sm:text-left">
                        {aboutText}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;
