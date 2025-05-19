import { AuthLayout } from "@/components/Layout/layout";
import UseFinanceHook from "@/hooks/UseFinance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AllGroupsPage() {
    const { getAllGroups } = UseFinanceHook(); 
    const [groups, setGroups] = useState<{ id: number; name: string; description: string; img?: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const fetchedGroups = await getAllGroups();
                console.log(fetchGroups);
                
                setGroups(fetchedGroups);
            } catch (error) {
                console.error("Failed to fetch groups");
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    return (
        <AuthLayout>
            <div className="sm:px-16 px-8">
                <div className="min-h-screen flex flex-col bg-gray-100">
                    {/* Header */}
                    <div className="bg-gray-400 text-white flex items-center justify-between p-4 shadow-md">
                        <h1 className="font-bold text-lg">All Groups</h1>
                        <Link
                            to="/create-group"
                            className="bg-black-600 text-white px-4 py-2 rounded-full shadow hover:bg-gray-700"
                        >
                            Create Group
                        </Link>
                    </div>

                    {/* Groups List */}
                    <div className="flex-grow bg-gray-50 p-4">
                        {loading ? (
                            <p>Loading groups...</p>
                        ) : groups.length === 0 ? (
                            <p>No groups found. Click "Create Group" to add one.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groups.map((group) => (
                                    <Link
                                        to={`/user/user-group/${group.id}`}
                                        key={group.id}
                                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                                                {group.img ? (
                                                    <img
                                                        src={group.img}
                                                        alt={group.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <span className="text-gray-500">{group.name[0]}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-lg">{group.name}</h2>
                                                <p className="text-sm text-gray-600">{group.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
