import { AuthLayout } from "@/components/Layout/layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/Ui/Button";
import UseFinanceHook from "@/hooks/UseFinance";

export default function RemoveMember() {
    const { getGroupUsers, RemoveUserFromGroup } = UseFinanceHook();
    const [users, setUsers] = useState<{ id: number; username: string; email: string }[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    const handleCheckboxChange = (userId: number) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleRemoveUsers = async () => {
        toast.promise(
            RemoveUserFromGroup({ group_id: Number(id), user_id: selectedUsers }),
            {
                pending: "Removing users...",
                success: {
                    render({ data }) {
                        return <div>{data as string}</div>;
                    },
                },
                error: {
                    render({ data }) {
                        return <div>{data as string}</div>;
                    },
                },
            }
        );
    };

    useEffect(() => {
        (async () => {
            try {
            const groupUsers = await getGroupUsers(Number(id));
            const filteredUsers = groupUsers.filter((user: { role: string; pivot: { role: string } }) => user.pivot.role !== 'admin');
            console.log(filteredUsers);
            setUsers(filteredUsers);
            } catch (error) {
            console.error("Failed to fetch all users", error);
            }
        })();
    }, []);

    return (
        <AuthLayout>
            <div className="p-6 max-w-4xl mx-auto">
                <Button
                    text="Back"
                    className="!bg-gray-300 !text-gray-950 font-semibold px-8 py-2 shadow-md flex items-center space-x-2 mb-6"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Users</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white p-4 shadow rounded-lg flex items-center space-x-4 border hover:shadow-lg"
                        >
                            <input
                                type="checkbox"
                                id={`user-${user.id}`}
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleCheckboxChange(user.id)}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`user-${user.id}`} className="flex-grow">
                                <p className="text-lg font-medium text-gray-700">{user.username}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </label>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleRemoveUsers}
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                    Remove Selected Members
                </button>
            </div>
        </AuthLayout>
    );
}