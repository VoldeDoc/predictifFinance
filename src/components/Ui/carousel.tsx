import { Carousel } from "flowbite-react";
import CarouselItem from "@/components/Ui/carouselItem"

export function CarouselHolder() {
  const carouselItems = [
    {
      text: "“Axpos has been an essential part of our restaurant’s success. It’s easy for our staff to use, and the integration with our kitchen and bar systems has improved order accuracy. Our customers have noticed the difference!”",
      author: "Madison Lee",
      role: "Restaurant owner",
    },
    {
      text: "“Axpos has been an essential part of our restaurant’s success. It’s easy for our staff to use, and the integration with our kitchen and bar systems has improved order accuracy. Our customers have noticed the difference!”",
      author: "Madison ",
      role: "Restaurant ",
    },
    {
      text: "“Axpos has been an essential part of our restaurant’s success. It’s easy for our staff to use, and the integration with our kitchen and bar systems has improved order accuracy. Our customers have noticed the difference!”",
      author: "Madison James",
      role: "Restaurant owner",
    },
    {
      text: "“Axpos has been an essential part of our restaurant’s success. It’s easy for our staff to use, and the integration with our kitchen and bar systems has improved order accuracy. Our customers have noticed the difference!”",
      author: "Madison Abb",
      role: "owner",
    },
    
  ];

  return (
    <div className="container mx-auto my-10">
      <div className="h-96 sm:h-[30rem] lg:h-[40rem] xl:h-[50rem] 2xl:h-[60rem]">
        <Carousel>
          {carouselItems.map((item, index) => (
            <CarouselItem
              key={index}
              text={item.text}
              author={item.author}
              role={item.role}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
}