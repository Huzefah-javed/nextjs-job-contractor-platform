import ContractorProfileCard from "../components/ContractorProfileBar";
import ContractorSidebar from "../components/ContractorSidebar";

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-full flex ">
      <ContractorSidebar />
      <div className="flex-[80%]">{children}</div>
      <ContractorProfileCard />
    </div>
  );
}
