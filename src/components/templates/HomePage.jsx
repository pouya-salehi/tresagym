//Components
import BannerCinematic from "../home/Banner";
import Services from "../home/Services";
import About from "../home/About";
import Testimonials from "../home/TestiMonials";
function HomePage() {
  return (
    <div className="">
      <BannerCinematic />
      <Services />
      {/* <About /> */}
      <Testimonials />
    </div>
  );
}

export default HomePage;
