import { AuthLayout } from "@/components/Layout/layout";
import { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Ui/Button";
import UseFinanceHook from "@/hooks/UseFinance";
export default function AddMembersPage() {
    const { getAllUsers, AddUserToGroup, getGroupUsers } = UseFinanceHook();
    const [users, setUsers] = useState<{ id: number, username: string, email: string }[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const usersPerPage = 9;
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            try {
                const response = await getAllUsers();
                const groupUsers = await getGroupUsers(Number(id));
                const filteredUsers = response[0].filter((user: { id: number }) =>
                    !groupUsers.some(
                        (groupUser: any) =>
                            groupUser.id === user.id && groupUser.pivot.group_id === Number(id)
                    )
                );
                    setUsers(filteredUsers);
            } catch (error) {
                console.error("Failed to fetch all users", error);
            }
        })();
    }, []);
    


    const handleCheckboxChange = (userId: number) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleAddUsers = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        toast.promise(
            AddUserToGroup({ group_id: Number(id), user_id: selectedUsers }),
            {
                pending: "Adding users...",
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <AuthLayout>
            <div className="p-6 max-w-4xl mx-auto">
                <Button
                    text="Back"
                    className="!bg-gray-300 !text-gray-950 font-semibold px-8 py-2 shadow-md flex items-center space-x-2 mb-6"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Users</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="mb-6 p-2 border border-gray-300 rounded-lg w-full"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {currentUsers.map((user) => (
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
                    onClick={handleAddUsers}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                    Add Selected Users
                </button>
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </AuthLayout>
    );
}