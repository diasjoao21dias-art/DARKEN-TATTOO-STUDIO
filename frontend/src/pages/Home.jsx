import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Process } from "@/components/Process";
import { RequestForm } from "@/components/RequestForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main data-testid="home-page" className="relative">
      <SmoothScroll />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Gallery />
      <Process />
      <RequestForm />
      <Footer />
    </main>
  );
}
