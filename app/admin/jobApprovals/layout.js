import AdminSidebar from "@/app/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-full flex ">
      <AdminSidebar />
      <div className="flex-[80%]">{children}</div>
    </div>
  );
}
