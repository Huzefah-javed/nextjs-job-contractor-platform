import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import PricingCards from "./components/PricingCards";
import VerifiedContractors from "./components/VerifiedContractor";

export default function Home() {
  return (
    <>
      <Header />
      <div className="pl-2 pr-2">
      <Hero />
      <VerifiedContractors/>
      <HowItWorks/>
      <PricingCards/>
      <Footer/>
      </div>
    </>
  );
}
