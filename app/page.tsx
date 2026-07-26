"use client";
import { useState, useEffect } from "react";
import Navbar  from "./components/Navbar";
import Hero    from "./components/Hero";
import About   from "./components/About";
import ProjectsSection from "./components/Project";
import Contact from "./components/Contact";
import Footer  from "./components/Footer";
import TechnicalOverlay from "./components/TechnicalOverlay";
import SectionFrameBar  from "./components/SectionFrameBar";
import {
  NavbarSkeleton,
  HeroSkeleton,
  AboutSkeleton,
  SkillsSkeleton,
  ContactSkeleton,
  FooterSkeleton,
} from "./components/Skeleton";

export default function Home() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const openContactForm  = () => setIsContactFormOpen(true);
  const closeContactForm = () => setIsContactFormOpen(false);

  if (!ready) {
    return (
      <>
        <TechnicalOverlay />
        <NavbarSkeleton />
        <main>
          <HeroSkeleton />
          <AboutSkeleton />
          <SkillsSkeleton />
          <ContactSkeleton />
        </main>
        <FooterSkeleton />
      </>
    );
  }

  return (
    <div className="page-ready">
      <TechnicalOverlay />
      <Navbar />
      <main>
        <Hero openContactForm={openContactForm} />
        <About />
        <section id="project">
          <ProjectsSection />
        </section>
        <Contact
          isFormOpen={isContactFormOpen}
          onOpenForm={openContactForm}
          onCloseForm={closeContactForm}
        />
      </main>
      <Footer />
      <SectionFrameBar />
    </div>
  );
}