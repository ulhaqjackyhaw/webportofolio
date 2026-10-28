import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Skill from "@/components/Skill/Skill";
import Work from "@/components/Project/ProjectCard";
import Certificate from "@/components/Certificate/Certificate";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import LenisComponent from '@/libs/LenisComponent';
import Animation from '@/libs/Animation';
import { getSkills, getProjects, getCertificates } from '@/libs/supabase/data';

export const revalidate = 0;

export default async function Home() {
  const [skills, projects, certificates] = await Promise.all([
    getSkills(),
    getProjects(),
    getCertificates(),
  ]);

  return (
    <LenisComponent>
      <Header />
      <main>
        <Hero />
        <About />
        <Skill initialSkills={skills} />
        <Work initialProjects={projects} />
        <Certificate initialCertificates={certificates} />
        <Contact />
      </main>
      <Footer />
      <Animation />
    </LenisComponent>
  );
}
