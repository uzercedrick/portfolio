'use client';
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Studies from "../components/Studies";
import Footer from "../components/Footer";
import { NavbarSkeleton, SkillsSkeleton, FooterSkeleton } from "../components/Skeleton";

export default function StudiesPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    requestAnimationFrame(() => {
      if (mounted) setReady(true);
    });
    return () => { mounted = false; };
  }, []);

  // Debug: Confirm state in console
  useEffect(() => {
    console.log("Studies page ready:", ready);
  }, [ready]);

  if (!ready) {
    return (
      <>
        <NavbarSkeleton />
        <main><SkillsSkeleton /></main>
        <FooterSkeleton />
      </>
    );
  }

  return (
    <div className="page-ready min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Studies />
      </main>
      <Footer />
    </div> 
  );
}