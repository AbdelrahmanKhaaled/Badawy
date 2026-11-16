import CinematicPreloader from "@/components/animations/CinematicPreloader";
import AboutUs from "@/components/sections/AboutUs";
import CapabilityBar from "@/components/sections/CapabilityBar";
import CapturingMoments from "@/components/sections/CapturingMoments";
import ClientLogos from "@/components/sections/ClientLogos";
import FeaturedWorks from "@/components/sections/FeaturedWorks";
import FinalCTA from "@/components/sections/FinalCTA";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Statistics from "@/components/sections/Statistics";
import Testimonials from "@/components/sections/Testimonials";
import WhyChooseUs from "@/components/sections/WhyChooseUs";

export default function Home() {
  return (
    <>
      <CinematicPreloader />
      <main id="main" className="pt-[84px]">
        <Hero />
        <CapabilityBar />
        <CapturingMoments />
        <AboutUs />
        <Services />
        <FeaturedWorks />
        <WhyChooseUs />
        <Statistics />
        <Testimonials />
        <ClientLogos />
        <FinalCTA />
      </main>
    </>
  );
}
