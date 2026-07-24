"use client";
import { useState, useEffect } from "react";
import Navbar  from "./components/Navbar";
import Hero    from "./components/Hero";
import About   from "./components/About";
import ProjectsSection from "./components/Project";
import Contact from "./components/Contact";
import Footer  from "./components/Footer";
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
      <Navbar />
      <main>
        <Hero openContactForm={openContactForm} />
        <About />
        <ProjectsSection />
        <Contact
          isFormOpen={isContactFormOpen}
          onOpenForm={openContactForm}
          onCloseForm={closeContactForm}
        />
      </main>
      <Footer />
    </div>
  );
}