export const brands = [
    "/assets/images/brands/aeromiz.png",
    "/assets/images/brands/aroflit.png",
    "/assets/images/brands/sevanes.png",
    "/assets/images/brands/happenz.png",
    "/assets/images/brands/oboobr.png",
  ];
  
  const BrandCarousel = () => {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {brands.map((brand, index) => (
          <img
            key={index}
            src={brand}
            alt={`Brand ${index + 1}`}
            className="w-1/2 sm:w-1/4 h-24 object-contain"
          />
        ))}
      </div>
    );
  };
  
  export default BrandCarousel;