import React from "react";

interface ForumData {
  text: string;
  topic_img: string;
  author: string;
  comment: number;
  views: number;
  likes: number;
  topic: string[];
  author_img: string;
  date: string;
}

interface NewsForumProps {
  forumData: ForumData[];
}




export const ForumData = [
    {
      text: "New Innovations in AI Technology",
      topic_img: "assets/images/dashboard/dashboard/Rectangle 24 (1).png",
      author: "Jane Doe",
      comment: 12345,
      views: 67890,
      likes: 23456,
      topic: ["AI", "Technology", "Innovation"],
      author_img: "assets/images/dashboard/dashboard/user.png",
      date: "3 weeks ago"
    },
    {
      text: "The Future of Quantum Computing",
      topic_img: "assets/images/dashboard/dashboard/Rectangle 24 (2).png",
      author: "John Smith",
      comment: 54321,
      views: 98765,
      likes: 34567,
      topic: ["Quantum", "Computing", "Future"],
      author_img: "assets/images/dashboard/dashboard/user.png",
      date: "1 week ago"
    },
    {
      text: "The Future of Quantum Computing",
      topic_img: "assets/images/dashboard/dashboard/Rectangle 24 (2).png",
      author: "John Smith",
      comment: 54321,
      views: 98765,
      likes: 34567,
      topic: ["Quantum", "Computing", "Future"],
      author_img: "assets/images/dashboard/dashboard/user.png",
      date: "1 week ago"
    },
    {
      text: "The Future of Quantum Computing",
      topic_img: "assets/images/dashboard/dashboard/Rectangle 24 (2).png",
      author: "John Smith",
      comment: 54321,
      views: 98765,
      likes: 34567,
      topic: ["Quantum", "Computing", "Future"],
      author_img: "assets/images/dashboard/dashboard/user.png",
      date: "1 week ago"
    },
    {
      text: "The Future of Quantum Computing",
      topic_img: "assets/images/dashboard/dashboard/Rectangle 24 (2).png",
      author: "John Smith",
      comment: 54321,
      views: 98765,
      likes: 34567,
      topic: ["Quantum", "Computing", "Future"],
      author_img: "assets/images/dashboard/dashboard/user.png",
      date: "1 week ago"
    },
    // Add more forum data as needed
  ];

 export  const MessageBoxForum =  [
    {
      text: "The Future of Quantum Computing",
      topic_img: "assets/images/dashboard/dashboard/Rectangle 24 (2).png",
      author: "John Smith",
      comment: 54321,
      views: 98765,
      likes: 34567,
      topic: ["Quantum", "Computing", "Future"],
      author_img: "assets/images/dashboard/dashboard/user.png",
      date: "1 week ago"
    }
 ]

const NewsForum: React.FC<NewsForumProps> = ({ forumData }) => {
  return (
    <div>
      {forumData.map((data, index) => (
       <a href="/messages">
         <div key={index} className="bg-white cursor-pointer flex flex-row flex-wrap lg:flex-nowrap rounded-xl space-x-4 mt-5 px-4 py-5 hover:bg-black-400 transition-transform duration-300 transform hover:scale-105">
          <div>
            <img src={data.topic_img} alt="Post Image" width={150} height={300} />
          </div>

          <div className="flex flex-col justify-between">
            <p className="font-semibold text-xl overflow-hidden text-ellipsis whitespace-nowra">
              {data.text}
            </p>
            <div className="topic flex rounded-lg space-x-4 py-4">
              {data.topic.map((t, index) => (
                <p key={index} className="rounded-xl bg-black-900 text-gray-400 text-sm px-3 py-1">{t}</p>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between mt-6 space-y-4 md:space-y-0 md:space-x-4">
              <div className="profile flex mt-3 pr-5">
                <div>
                  <img src={data.author_img} alt="Author" className="rounded-full mr-1 border-2 border-white shadow-sm" width={50} height={50} />
                </div>
                <div className="name">
                  <p className="font-bold">{data.author} </p>
                  <p className="text-xs">{data.date}</p>
                </div>
              </div>

              <div className="flex justify-between space-x-4 mt-2 lg:mt-4 pt-5">
                <p className="text-xs">{data.views.toLocaleString()} Views</p>
                <p className="text-xs">{data.likes.toLocaleString()} likes</p>
                <p className="text-xs">{data.comment.toLocaleString()} comments</p>
              </div>
            </div>
          </div>
      </div>
       </a>
      ))}
    </div>
  );
};

export default NewsForum;