
import { customCarouselTheme } from "@/utils/FlowBiteCustomThemes";
import { Carousel } from "flowbite-react";

export default function HomeCarousel() {

    const carouselItems = [
        {
            img: "assets/images/landingPage/man.png",
            alt: "Man"
        },
        {
            img: "assets/images/landingPage/man.png",
            alt: "Man"
        },
        {
            img: "assets/images/landingPage/man.png",
            alt: "Man"
        },
    ];


  return (
      <Carousel theme={customCarouselTheme} indicators={false} slideInterval={2000} leftControl={" "} rightControl={" "}>
        {carouselItems.map((item, index) => (
            <img key={index} src={item.img} alt={item.alt} className="w-full h-full object-cover" />
        ))}
      </Carousel>
  );
}
