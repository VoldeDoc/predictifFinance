import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const brands = [
  "/img/brands/aeromiz.png",
  "/img/brands/aroflit.png",
  "/img/brands/sevanes.png",
  "/img/brands/happenz.png",
  "/img/brands/oboobr.png",
];

const BrandCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-container w-3/4 !text-center mx-auto">
      <Slider {...settings}>
        {brands.map((brand, index) => (
          <div key={index} className="mt-10">
            <img
              src={brand}
              alt={`Brand ${index + 1}`}
              className="mx-auto w-2/4 h-auto"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BrandCarousel;
