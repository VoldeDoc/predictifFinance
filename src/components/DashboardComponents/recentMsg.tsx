import React, { useState } from 'react';
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { BiCommentDots } from "react-icons/bi";
import { TbUserHeart } from "react-icons/tb";
import { Dropdown } from "flowbite-react";

interface CommentData {
  id: number;
  message: string;
  time: string;
  userName: string;
}

interface MessageData {
  id: number;
  name: string;
  date: string;
  bgColor: string;
  message: string;
  likes: number;
  comments: CommentData[];
}

const initialMessages: MessageData[] = [
  {
    id: 1,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-green-900",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 2,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-yellow-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 3,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-red-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 4,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-blue-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 5,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-purple-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 6,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-pink-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 7,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-orange-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 8,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-teal-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 9,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-indigo-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
  {
    id: 10,
    name: "Nelson Sikki",
    date: "4 days ago",
    bgColor: "bg-gray-500",
    message: "How do you know your learners are retaining knowledge in appropriate volumes and timeframes? That’s right: You throw in assessments, and see if the students “catch your drift”. Obviously, there is a boring We could use many eloquent metaphors, yet it all boils down to the same: Keep your message",
    likes: 7,
    comments: []
  },
];

const RecentMsg: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [visibleMessageId, setVisibleMessageId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [commentText, setCommentText] = useState<string>('');
  const messagesPerPage = 3;

  const toggleVisibility = (id: number) => {
    setVisibleMessageId(visibleMessageId === id ? null : id);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
  };

  const addComment = (messageId: number) => {
    if (commentText.trim() === '') return;

    const newComment: CommentData = {
      id: Date.now(),
      message: commentText,
      time: new Date().toLocaleTimeString(),
      userName: "John Doe", // Replace with actual user name
    };

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, comments: [...msg.comments, newComment] } : msg
      )
    );

    setCommentText('');
    setVisibleMessageId(null);
  };

  const deleteMessage = (messageId: number) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
  };

  const deleteComment = (messageId: number, commentId: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, comments: msg.comments.filter((comment) => comment.id !== commentId) } : msg
      )
    );
  };

  const getInitials = (name: string) => {
    const initials = name.split(' ').map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  const startIndex = currentPage * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const displayedMessages = messages.slice(startIndex, endIndex);

  return (


    <div className="bg-white rounded-lg px-5 py-4 my-4">

      {displayedMessages.map((msg) => (
        <div key={msg.id}>
          <div className="flex justify-between">
            <div className="flex space-x-10">
              <div className={`${msg.bgColor} rounded-full w-12 h-12 flex items-center justify-center`}>
                <p className="text-white text-center">ES</p>
              </div>
              <div>
                <p className="font-bold">{msg.name}</p>
                <p className="text-sm text-gray-500">{msg.date}</p>
              </div>
            </div>
            <div>
              <Dropdown label="" placement="left-start" dismissOnClick={false} renderTrigger={() => <EllipsisVerticalIcon className="w-9 h-9 font-semibold" />}>
                <Dropdown.Item onClick={() => toggleVisibility(msg.id)}>Add</Dropdown.Item>
                <Dropdown.Item onClick={() => deleteMessage(msg.id)}>Delete</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
          <div className="pl-20 py-4">
            <p className="text-sm font-normal">{msg.message}</p>
            <div className="flex space-x-4 items-center mb-8">
              <p className="flex items-center space-x-1">
                <TbUserHeart className="w-4 h-4" /> <span>{msg.likes}</span>
              </p>
              <p className="flex items-center space-x-1 cursor-pointer hover:text-red-600" onClick={() => toggleVisibility(msg.id)}>
                <BiCommentDots className="w-6 h-6" /> <span>{msg.comments.length} comments</span>
              </p>
            </div>
            {visibleMessageId === msg.id && (
              <div className="mt-4">
                <div className="bg-white flex flex-col sm:flex-row rounded-lg space-y-4 sm:space-y-0 sm:space-x-6 py-6 px-3 justify-between items-center ">
                  <div className="hidden sm:flex bg-blue-900 rounded-full w-12 h-12 items-center justify-center flex-shrink-0">
                    <p className="text-white text-center">ES</p>
                  </div>

                  <div className="w-full sm:w-auto flex-grow">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Message"
                      className="w-full p-2 border rounded-lg bg-[#F9F9F9]"
                      rows={1.4} // Adjust the number of rows as needed
                    ></textarea>
                  </div>

                  <button onClick={() => addComment(msg.id)} className="px-5 bg-blue-800 rounded-lg text-white flex-shrink-0">Post</button>
                </div>
              </div>
            )}
            {visibleMessageId === msg.id && (
              <div className="mt-4">
                {msg.comments.map((comment) => (
                  <div key={comment.id} className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
                        <p className="text-white text-center">{getInitials(comment.userName)}</p>
                      </div>
                      <div>
                        <p className="text-sm">{comment.message}</p>
                        <p className="text-xs text-gray-500">{comment.time}</p>
                      </div>
                    </div>
                    <Dropdown label="" placement="left-start" dismissOnClick={false} renderTrigger={() => <EllipsisVerticalIcon className="w-5 h-5 font-semibold" />}>
                      <Dropdown.Item onClick={() => deleteComment(msg.id, comment.id)}>Delete</Dropdown.Item>
                    </Dropdown>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-center py-4 space-x-4">
        {currentPage > 0 && (
          <button onClick={prevPage} className="underline cursor-pointer hover:text-blue-800">
            View previous comments
          </button>
        )}
        {endIndex < messages.length && (
          <button onClick={nextPage} className="underline cursor-pointer hover:text-blue-800">
            View more comments
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentMsg;