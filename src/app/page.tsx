import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutUsSection from '../components/AboutUsSection';
import MessageSection from '../components/MessageSection';
import PopularJobsSection from '../components/PopularJobsSection';
import CompaniesShowcaseSection from '../components/CompaniesShowcaseSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutUsSection />
      <MessageSection />
     <PopularJobsSection />
      <CompaniesShowcaseSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
