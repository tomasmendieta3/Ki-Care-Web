import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AudienceSection from "@/components/AudienceSection";
import EquipmentSection from "@/components/EquipmentSection";
import TestimonialSection from "@/components/TestimonialSection";
import SupportSection from "@/components/SupportSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AudienceSection />
        <EquipmentSection />
        <TestimonialSection />
        <SupportSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
