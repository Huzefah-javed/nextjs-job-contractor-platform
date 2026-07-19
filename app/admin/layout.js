import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-full flex bg-black ">
      <AdminSidebar />
      <div className="flex-[80%]">{children}</div>
    </div>
  );
}
