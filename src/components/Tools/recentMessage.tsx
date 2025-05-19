import React, { useState, useEffect } from 'react';
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { Dropdown } from "flowbite-react";
import { useParams } from 'react-router-dom';
import { BiSend } from 'react-icons/bi';
import UseFinanceHook from '@/hooks/UseFinance';

type Message = {
  id: number;
  message: string;
  sender_id: number;
  is_sender: boolean;
  dateTime: string;
  sender_details: {
    id: number;
    username: string;
    email: string;
  };
};

type RecentMsgProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const RecentMsg: React.FC<RecentMsgProps> = ({ messages, setMessages }) => {
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState<string>('');
  
  const { id } = useParams<{ id: string }>();
  const { getMessage, EditMessage, deleteMessage } = UseFinanceHook();

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessage(Number(id));
        setMessages(response.messages || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [id, getMessage]);

  const formatTimestamp = (timestamp: string) =>
    new Date(timestamp).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
    });

  const handleEditMessage = async (messageId: number) => {
    if (!editingMessageText.trim()) return;

    try {
      await EditMessage({
        group_id: Number(id),
        message: editingMessageText,
        message_id: messageId,
      });

      // Refresh messages after edit
      const updatedMessagesResponse = await getMessage(Number(id));
      setMessages(updatedMessagesResponse.messages || []);

      setEditingMessageId(null);
      setEditingMessageText('');
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: number, deleteType: "me" | "all") => {
    try {
      await deleteMessage({
        message_id: messageId,
        group_id: Number(id),
        delete_type: deleteType,
      });

      // Refresh messages after delete
      const updatedMessagesResponse = await getMessage(Number(id));
      setMessages(updatedMessagesResponse.messages || []);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0].toUpperCase()).join('');

  return (
    <div className="bg-white rounded-lg px-5 py-4 my-4 max-h-96 overflow-y-auto">
      {messages.map((msg) => {
        const isEditable = new Date().getTime() - new Date(msg.dateTime).getTime() <= 5 * 60 * 1000;

        return (
          <div key={msg.id} className="mb-6">
            <div className="flex justify-between">
              <div className="flex space-x-10">
                <div className="bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center">
                  <p className="text-white text-center">{getInitials(msg.sender_details.username)}</p>
                </div>
                <div>
                  <p className="font-bold">{msg.sender_details.username}</p>
                  <p className="text-sm text-gray-500">{formatTimestamp(msg.dateTime)}</p>
                </div>
              </div>
              <Dropdown
                label=""
                placement="left-start"
                dismissOnClick={false}
                renderTrigger={() => (
                  <EllipsisVerticalIcon className="w-9 h-9 cursor-pointer" />
                )}
              >
                {isEditable && (
                  <Dropdown.Item
                    onClick={() => {
                      setEditingMessageId(msg.id);
                      setEditingMessageText(msg.message);
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={() => handleDeleteMessage(msg.id, "all")}>
                  Delete
                </Dropdown.Item>
              </Dropdown>
            </div>

            <div className="pl-20 py-4">
              {editingMessageId === msg.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editingMessageText}
                    onChange={(e) => setEditingMessageText(e.target.value)}
                    className="border rounded px-2 py-1 flex-grow"
                  />
                  <button
                    onClick={() => handleEditMessage(msg.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    <BiSend />
                  </button>
                  <button
                    onClick={() => {
                      setEditingMessageId(null);
                      setEditingMessageText('');
                    }}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-sm font-normal">{msg.message}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentMsg;
