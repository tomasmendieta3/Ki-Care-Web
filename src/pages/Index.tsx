import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemaSection from "@/components/ProblemaSection";
import PropuestaValorSection from "@/components/PropuestaValorSection";
import InversionSection from "@/components/InversionSection";
import TestimonialSection from "@/components/TestimonialSection";
import AudienceSection from "@/components/AudienceSection";
import SupportSection from "@/components/SupportSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProblemaSection />
        <PropuestaValorSection />
        <InversionSection />
        <TestimonialSection />
        <AudienceSection />
        <SupportSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
