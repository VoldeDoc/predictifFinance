import { AuthLayout } from "@/components/Layout/layout";
import RecentMsg from "@/components/Tools/recentMessage";
import UseFinanceHook from "@/hooks/UseFinance";
import { CogIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MessageBox() {
    const { getUserGroupById, sendMessage, getMessage } = UseFinanceHook();
    const [group, setGroup] = useState<{ name: string; description: string; img: string } | null>(null);
    const { id } = useParams<{ id: string }>();
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    // Fetch group data, users, and messages
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const groupData = await getUserGroupById(Number(id));
                const groupMessagesResponse = await getMessage(Number(id));
                setGroup(groupData);
                setMessages(groupMessagesResponse.messages || []);
            } catch (error) {
                console.error("Failed to fetch group or users data", error);
            }
        };
        fetchGroupData();
    }, [id, getMessage]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const data = {
                group_id: Number(id),
                message: newMessage,
            };
            const response = await sendMessage(data);
            console.log(response);
            // Fetch and update messages after sending
            const updatedMessagesResponse = await getMessage(Number(id));
            setMessages(updatedMessagesResponse.messages || []);

            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

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

    return (
        <AuthLayout>
            <div className="py-4 px-6 ">
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
                    onClick={() => window.history.back()}
                >
                    Back
                </button>

                <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-24">
                    <div className="max-w-full md:max-w-xl py-6">
                        <h2 className="text-2xl md:text-4xl text-black-700 font-bold">Group Chat</h2>
                    </div>
                    <div className="flex justify-start md:justify-end w-full md:w-auto mb-4 md:mb-10">
                        <button
                            className="bg-red-800 text-white px-8 md:px-16 py-2 shadow-md flex items-center space-x-2 transform transition-transform duration-300"
                            onClick={() => window.location.href = `/user/settings/${id}`}
                        >
                            Settings
                            <CogIcon className="inline-block ml-2" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap mt-10 space-x-6">
                    <div className="w-full lg:w-7/12">
                        <div className="my-5">
                            <p className="font-semibold text-xl ">{group?.name}</p>
                        </div>

                        <div className="bg-white flex rounded-lg space-x-6 py-6 px-3 justify-between items-center">
                            <div className="bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                                {group?.img ? (
                                    <img src={group.img} alt={group.name || "Group Image"} className="w-10 h-10 rounded-full" />
                                ) : (
                                    <span>{group?.name?.[0]}</span>
                                )}
                            </div>

                            <div className="w-full md:w-auto flex-grow">
                                <textarea
                                    name="post"
                                    id="post"
                                    placeholder="Message"
                                    className="w-full p-2 border rounded-lg bg-[#F9F9F9]"
                                    rows={1.4}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                className="px-5 bg-blue-800 rounded-lg text-white flex-shrink-0"
                                onClick={handleSendMessage}
                            >
                                Post
                            </button>
                        </div>

                        <RecentMsg messages={messages} setMessages={setMessages} />
                    </div>

                    <div className="w-full lg:w-4/12">
                        <div className="bg-white rounded-lg pt-4 pb-14 px-4 my-5">
                            <div>
                                {group?.img ? (
                                <img src={group.img} alt="" className="w-full h-32" />
                                ) : (
                                    <div className="bg-gray-300 rounded w-full h-32 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-3xl ">{group?.name?.[0]}</span>
                                    </div>
                                )}
                                <p className="font-semibold py-3 text-xl">Details</p>
                                <p>{group?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
