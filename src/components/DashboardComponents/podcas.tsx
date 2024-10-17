import { ArrowRightIcon } from "@heroicons/react/24/solid";
interface podcast{
    text:string;
    author:string;
    img:string;
}

interface PodcastProps{
    podcastData:podcast[];
}

export const PodcastData = [
    {
        text:"The Future of Quantum Computing",
        author:"John Smith",
        img:"assets/images/dashboard/dashboard/Rectangle 24 (2).png"
    },
    {
        text:"New Innovations in AI Technology",
        author:"Jane Doe",
        img:"assets/images/dashboard/dashboard/Rectangle 24 (1).png"
    },
    {
        text:"The Future of Quantum Computing",
        author:"John Smith",
        img:"assets/images/dashboard/dashboard/Rectangle 24 (2).png"
    },
    {
        text:"New Innovations in AI Technology",
        author:"Jane Doe",
        img:"assets/images/dashboard/dashboard/Rectangle 24 (1).png"
    },
    {
        text:"The Future of Quantum Computing",
        author:"John Smith",
        img:"assets/images/dashboard/dashboard/Rectangle 24 (2).png"
    },
    {
        text:"New Innovations in AI Technology",
        author:"Jane Doe",
        img:"assets/images/dashboard/dashboard/Rectangle 24 (1).png"
    }
]
const Podcast: React.FC<{ podcastData: any[] }> = ({ podcastData }) => {
    return (
      <div>
        {podcastData.map((data, index) => (
          <div
            key={index}
            className="flex py-3 transition duration-300 ease-in-out transform hover:bg-gray-100 hover:scale-105 group cursor-pointer"
          >
            <div>
              <img
                src={data.img}
                alt=""
                width={120}
                height={600}
                className="mr-1 rounded"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p>{data.text}</p>
                <ArrowRightIcon className="inline-block w-6 transition duration-300 ease-in-out transform group-hover:scale-125 group-hover:text-blue-500" />
              </div>
              <p className="text-xs text-gray-500">{data.author}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Podcast;