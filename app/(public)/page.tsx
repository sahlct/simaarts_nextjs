import HeroSection from "@/components/herosection"
import WhyChooseUs from "@/components/whyChooseUs"
import HomeAbout from "@/components/homeAbout"
import NewArrivals from "@/components/newArrivals"
import SuccesStories from "@/components/successStories"
import HomeTestimonials from "@/components/homeTestimonials"
import HomeShorts from "@/components/HomeShorts"
import CategorySlider from "@/components/categoryslider"
import CollectionSection from "@/components/CollectionSection"
import OurServices from "@/components/ourServices"
import HomeProjects from "@/components/homeProjects"
import CTASection from "@/components/CTASection"
import { getCarousels } from "@/lib/api/carousel"

export default async function Home() {
  let initialCarousel = null;
  try {
    const res = await getCarousels(1, 1, "", 1);
    if (res?.data && res.data.length > 0) {
      initialCarousel = res.data[0];
    }
  } catch (error) {
    console.error("Failed to fetch initial carousel:", error);
  }

  return (
    <main className="min-h-screen">
      <HeroSection initialData={initialCarousel} />
      <CollectionSection />
      <CategorySlider />
      <HomeProjects />
      <CTASection />
      <OurServices />
      <HomeShorts />
      <HomeTestimonials />
    </main>
  )
}