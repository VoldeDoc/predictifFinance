import { AuthLayout } from "@/components/Layout/layout";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CogIcon } from "@heroicons/react/24/outline";
import { BiSend } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import UseFinanceHook from "@/hooks/UseFinance";

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

export default function UserGroupPage() {
  const { getUserGroupById, getGroupUsers, sendMessage, getMessage, EditMessage, username, deleteMessage } = UseFinanceHook();
  const [group, setGroup] = useState<{ name: string; description: string; img: string } | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<{ id: number; username: string; avatar?: string }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatLocked, setIsChatLocked] = useState(false);

  const checkIfChatIsLocked = async () => {
    try {
      const groupData = await getUserGroupById(Number(id));
      setIsChatLocked(groupData.is_chat_closed);
    } catch (error) {
      console.error("Failed to check if chat is locked", error);
    }
  };

  useEffect(() => {
    checkIfChatIsLocked();
  }, [id]);

  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");

  const toggleDropdown = (messageId: number) => {
    setDropdownVisible(dropdownVisible === messageId ? null : messageId);
  };

  // Fetch group data, users, and messages
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupData = await getUserGroupById(Number(id));
        const groupUsers = await getGroupUsers(Number(id));
        const groupMessagesResponse = await getMessage(Number(id));
        console.log(groupMessagesResponse);
        setGroup(groupData);
        setUsers(groupUsers);

        // Extract messages from the response
        setMessages(groupMessagesResponse.messages || []);
      } catch (error) {
        console.error("Failed to fetch group or users data", error);
      }
    };
    fetchGroupData();
  }, [id, getMessage]);

  const formatTimestamp = (timestamp: string) =>
    new Date(timestamp).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
    });

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const data = {
        group_id: Number(id),
        message: newMessage,
      };
      console.log("Sending Message:", data);
      const response = await sendMessage(data);

      console.log("Message sent successfully:", response);

      // Fetch and update messages after sending
      const updatedMessagesResponse = await getMessage(Number(id));
      setMessages(updatedMessagesResponse.messages || []);

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEditMessage = async (messageId: number) => {
    if (!editingMessageText.trim()) return;
    try {
      const data = {
        group_id: Number(id),
        message: editingMessageText,
        message_id: messageId,
      };
      console.log("Editing Message:", data);
      const response = await EditMessage(data);

      console.log("Message edited successfully:", response);

      // Fetch and update messages after editing
      const updatedMessagesResponse = await getMessage(Number(id));
      setMessages(updatedMessagesResponse.messages || []);
      setEditingMessageId(null);
      setEditingMessageText("");
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: number, deleteType: "me" | "all") => {
    try {
      const response = await deleteMessage({ message_id: messageId, group_id: Number(id), delete_type: deleteType });
      console.log(response);

      // Fetch and update messages after deletion
      const updatedMessagesResponse = await getMessage(Number(id));
      setMessages(updatedMessagesResponse.messages || []);
    } catch (error) {
      console.error(`Failed to delete message for ${deleteType}`, error);
    }
  };

  return (
    <AuthLayout>
      <div className="sm:px-16 px-8">
        <div className="min-h-screen flex flex-col bg-gray-100">
          {/* Header */}
          <div className="bg-gray-400 text-white flex items-center justify-between p-4 shadow-md">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-green-800 font-bold">
                {group?.img ? (
                  <img src={group.img} alt={group.name || "Group Image"} className="w-10 h-10 rounded-full" />
                ) : (
                  <span>{group?.name?.[0]}</span>
                )}
              </div>
              <div>
                <h1 className="font-bold text-lg">{group?.name || "My Group"}</h1>
                <p className="text-sm sm:text-base">{group?.description || "Group description"}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/user/settings/${id}`)}
              className="text-white text-lg"
            >
              <CogIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Group Users Section */}
          <div className="bg-white p-4 border-b border-gray-300">
            <h2 className="font-bold text-lg mb-4">Group Members</h2>
            <div className="flex flex-wrap gap-4">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-4">
                  <img
                    src={user.avatar || "https://via.placeholder.com/40"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex-grow bg-gray-50 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_details?.username === username ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-full sm:max-w-xs p-3 rounded-lg shadow relative ${message.sender_details?.username === username
                      ? "bg-green-200 text-black"
                      : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    <div className="absolute top-0 right-0 mt-2 mr-2 z-20">
                      <BsThreeDotsVertical
                        className="cursor-pointer"
                        onClick={() => toggleDropdown(message.id)}
                      />
                      {dropdownVisible === message.id && (
                        <div className="absolute right-0 mt-2 w-20 bg-white border border-gray-300 rounded-md shadow-lg z-30">
                            {new Date().getTime() - new Date(message.dateTime).getTime() <= 4 * 60 * 1000 && (
                            <button
                              onClick={() => {
                              setEditingMessageId(message.id);
                              setEditingMessageText(message.message);
                              setDropdownVisible(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            )}
                          <button
                            onClick={() => {
                              setDropdownVisible(null);
                              handleDeleteMessage(message.id, "me");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Delete 
                          </button>
                          {/* <button
                            onClick={() => {
                              setDropdownVisible(null);
                              handleDeleteMessage(message.id, "all");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Delete for all
                          </button> */}
                        </div>
                      )}
                    </div>
                    {editingMessageId === message.id ? (
                      <div>
                        <input
                          type="text"
                          value={editingMessageText}
                          onChange={(e) => setEditingMessageText(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                        <button
                          onClick={() => handleEditMessage(message.id)}
                          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          <BiSend />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p>
                          {message.sender_details?.username === username ? "You" : message.sender_details?.username}
                        </p>
                        <p>{message.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimestamp(message.dateTime)}</p>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
            )}
          </div>

          {/* Message Input */}
          {!isChatLocked ? (
            <div className="bg-white border-t border-gray-300 p-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow p-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700"
                >
                  <BiSend />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-300 text-center p-4">
              <p className="text-gray-700">Chat is locked by the group admin.</p>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}