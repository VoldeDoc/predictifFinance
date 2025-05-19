import { AuthLayout } from "@/components/Layout/layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AssignMemberRoleValues, UserRole } from "@/types";
import Button from "@/components/Ui/Button";
import UseFinanceHook from "@/hooks/UseFinance";

type User = {
    id: number;
    username: string;
    email: string;
    role: "member" | "moderator";
};

const validRoles = ["member", "moderator"];

export default function AssignRolesPage() {
    const { getGroupUsers, AssignRole } = UseFinanceHook();
    const [groupUsers, setGroupUsers] = useState<User[]>([]);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // Fetch Group Users
    useEffect(() => {
        const fetchGroupUsers = async () => {
            try {
                const response = await getGroupUsers(Number(id));
                console.log(response);
                
                if (response) {
                    const roleOrder: { [key: string]: number } = { "admin": 1, "moderator": 2, "member": 3 };

                    const users: User[] = response
                        .map((user: any) => ({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.pivot.role.toLowerCase() as "member" | "moderator",
                        }))
                        .filter((user: User) => validRoles.includes(user.role))
                        .sort((a: User, b: User) => roleOrder[a.role] - roleOrder[b.role]);

                    setGroupUsers(users);
                }
            } catch (error) {
                console.error("Failed to fetch group users", error);
            }
        };
        fetchGroupUsers();
    }, [id]);

    

    const handleRoleChange = (userId: number, newRole: string) => {
        setGroupUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, role: newRole as "member" | "moderator" } : user
            )
        );
        console.log(`User ${userId} role changed to ${newRole}`);
    };

    // Save Roles
    const handleSaveRoles = async () => {
        const userRoles: UserRole[] = groupUsers.map((user) => ({
            user_id: user.id,
            role: user.role,
        }));

        const data: AssignMemberRoleValues = {
            group_id: Number(id),
            user_role: userRoles,
        };

        toast.promise(
            AssignRole(data),
            {
                pending: "Assigning roles...",
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

    return (
        <AuthLayout>
            <div className="p-6 max-w-4xl mx-auto">
            <Button
                    text="Back"
                    className="!bg-gray-300 !text-gray-950 font-semibold px-8 py-2 shadow-md flex items-center space-x-2 mb-6"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Assign Roles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {groupUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white p-4 shadow rounded-lg border hover:shadow-lg flex flex-col space-y-2"
                        >
                            <p className="text-lg font-medium text-gray-700">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="flex items-center space-x-2">
                                <label htmlFor={`role-${user.id}`} className="text-sm font-medium text-gray-600">
                                    Role:
                                </label>
                                <select
                                    id={`role-${user.id}`}
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                >
                                    <option value="member">Member</option>
                                    <option value="moderator">Moderator</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleSaveRoles}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                    Save Changes
                </button>
            </div>
        </AuthLayout>
    );
}