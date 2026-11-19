"use client";

import { useEffect } from "react";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import ParkMap from "@/components/ParkMap";
import Story from "@/components/Story";
import Tickets from "@/components/Tickets";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { useReveal } from "@/hooks/useReveal";

export default function Home() {
  useReveal();

  // Al cargar, vuelve a observar los elementos .reveal que aparecen tras el loader
  useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Loader />
      <Header />
      <main>
        <Hero />
        <Attractions />
        <ParkMap />
        <Story />
        <Tickets />
        <Visit />
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
