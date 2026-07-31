import AdminSidebar from "../components/AdminSidebar";
import ClientProfileCard from "../components/ClientProfilebar";
import ClientSidebar from "../components/ClientSidebar";

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-full flex gap-4 ">
      <ClientSidebar />
      <div className="flex-[80%]">{children}</div>
      <ClientProfileCard />
    </div>
  );
}
