export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Root layout already provides the global Sidebar and Header. */}
      {children}
    </div>
  );
}
