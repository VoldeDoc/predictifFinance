import { AuthLayout } from "@/components/Layout/layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Ui/Button";
import UseFinanceHook from "@/hooks/UseFinance";

type User = {
    id: number;
    username: string;
    email: string;
    role: string;
    joined_at: string;
};

export default function AllUsersPage() {
    const { getGroupUsers } = UseFinanceHook();
    const { id } = useParams<{ id: string }>();
    const [groupUsers, setGroupUsers] = useState<User[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await getGroupUsers(Number(id));
                if (response) {
                    console.log(response);

                    const roleOrder: { [key: string]: number } = { 'admin': 1, 'moderator': 2, 'user': 3 };
                    const users = response.map((user: any) => ({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.pivot.role,
                        joined_at: user.pivot.joined_at,
                    })).sort((a: User, b: User) => {
                        return (roleOrder[a.role] ?? 4) - (roleOrder[b.role] ?? 4);
                    });
                    setGroupUsers(users);
                }
            } catch (error) {
                console.error("Failed to fetch group users", error);
            }
        })();
    }, [id]);

    return (
        <AuthLayout>
            <div className="p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">All Users</h2>
                {/* Back Button */}
                <div className="mt-6 pb-8">
                    <Button
                        text="Back to Settings"
                        className="!bg-gray-300 !text-gray-950 font-semibold px-8 py-2 shadow-md flex items-center space-x-2"
                        onClick={() => navigate(-1)}
                    />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 overflow-y-auto max-h-[400px]">
                    <ul className="space-y-4">
                        {groupUsers.map((user) => (
                            <li
                                key={user.id}
                                className="flex items-center justify-between p-4 border-b last:border-none"
                            >
                                <div>
                                    <p className="text-lg font-medium text-gray-700">{user.username}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div>
                                    {user.role === 'admin' || user.role === 'moderator' ? (
                                        <span className="text-red-600 font-semibold">{user.role}</span>
                                    ) : (
                                        <span className="text-blue-800 font-semibold">{user.role}</span>
                                    )}
                                    <p className="text-sm text-gray-500">{user.joined_at}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthLayout>
    );
}