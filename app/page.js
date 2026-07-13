import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <div className="pl-2 pr-2">
      <Hero />
      </div>
    </>
  );
}
