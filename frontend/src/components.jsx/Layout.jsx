import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="h-screen overflow-hidden bg-base-100 flex">
      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col h-full min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto relative">
          {/* Ambient background accents — fixed to viewport, sits behind content */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-1/3 -left-32 size-96 rounded-full bg-secondary/10 blur-3xl" />
          </div>

          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;