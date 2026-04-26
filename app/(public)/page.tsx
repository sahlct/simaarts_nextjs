import HeroSection from "@/components/herosection"
import WhyChooseUs from "@/components/whyChooseUs"
import HomeAbout from "@/components/homeAbout"
import NewArrivals from "@/components/newArrivals"
import SuccesStories from "@/components/successStories"
// import BrandsSlider from "@/components/brandsSlider"
import HomeTestimonials from "@/components/homeTestimonials"
import CategorySlider from "@/components/categoryslider"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HomeAbout />
      <NewArrivals />
      <WhyChooseUs />
      <SuccesStories />
      {/* <BrandsSlider/> */}
      <CategorySlider />
      <HomeTestimonials />
      
      
      {/* <HomeServices /> */}
      {/* <MockupSection /> */}
      {/* <HomeTechnologies /> */}
      {/* <TechnologyPartner /> */}

      {/* <Hero /> */}
      {/* <AboutUs /> */}
      {/* <Courses /> */}
      {/* <RankHolders /> */}
      {/* <RankHoldersForum /> */}
      {/* <SuccessStories/> */}
      {/* <Publications /> */}
      {/* <HybridLearning /> */}
      {/* <AceShorts /> */}
      {/* <LatestNews /> */}
      {/* <SocialService /> */}
      {/* <Branches /> */}
      {/* <OurFeatures /> */}
    </main>
  )
}