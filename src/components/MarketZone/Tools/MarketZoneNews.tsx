function MarketNews() {
  const news = [
    {
      title: "MLBL",
      description: "Finance",
      image: "https://placehold.co/150?text=MLBL",
      percentage: "12%",
    },
    {
      title: "SFCL",
      description: "Finance",
      image: "https://placehold.co/150?text=SFCL",
      percentage: "12%",
    },
    {
      title: "NTC",
      description: "Finance",
      image: "https://placehold.co/150?text=NTC",
      percentage: "76%",
    },
    {
      title: "SHIVAM",
      description: "Finance",
      image: "https://placehold.co/150?text=SHIVAM",
      percentage: "12%",
    },
  ];

  return (
    <div className="row mt-4 justify-between">
      <h1 className="text-gray-200"> News</h1>
      {news.map((news, index) => (
        <div className="col-xl-3" key={index}>
          <div className="bg-gray-850 mt-3 rounded-xl text-gray-200 py-5 px-6">
            <div className="flex justify-between items-center">
              <div className="flex justify-between gap-5 items-center flex-rap">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-16 h-16 rounded-full"
                />
                <span>
                  <h5 className="mt-2">{news.title}</h5>
                  <small className="text-center text-gray-500 mt-2 uppercase">
                    {news.description}
                  </small>
                </span>
              </div>
              <h2>{news.percentage}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MarketNews;
