import Header from "./Header";
import Footer from "./Footer";

async function MainLayout({ children }) {
  return (
    <div className="bg-gradient-to-br from-black via-gray-800 to-black">
      <div className="relative z-10">
        <Header />
        <div className="main">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
