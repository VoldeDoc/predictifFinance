import { AuthLayout } from "@/components/Layout/layout";
import { createGroupValues } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Button from "@/components/Ui/Button";
import UseFinanceHook from "@/hooks/UseFinance";

export default function UpdateGroupPage() {
    const { updateGroup, getGroupUsers } = UseFinanceHook();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
  
    useEffect(() => {
        (async () => {
            try {
                const groupUsers = await getGroupUsers(Number(id));
                const pivotData = groupUsers.map((user: any) => user.pivot);
                const isAdmin = pivotData.some((user: any) => user.role === "admin");
                if (!isAdmin) {
                    toast.error("You are not authorized to update this group");
                    navigate(-1); // Redirect back
                }
            } catch (error) {
                console.error("Failed to fetch group users", error);
            }
        })();
    }, [id, navigate]);

    const schema = yup.object().shape({
        name: yup.string().required("Group name is required"),
        description: yup.string().required("Group description is required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<createGroupValues>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const SubmitForm: SubmitHandler<createGroupValues> = async (data) => {
        toast.promise(
            updateGroup(Number(id), data),
            {
                pending: "Updating group...",
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
              <div className="px-16 py-10">
              <Button
                    text="Back"
                    className="!bg-gray-300 !text-gray-950 font-semibold px-8 py-2 shadow-md flex items-center space-x-2 mb-6"
                    onClick={() => navigate(-1)}
                />
              </div>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
                {/* Form Wrapper */}
                <form
                    onSubmit={handleSubmit(SubmitForm)}
                    className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 space-y-6"
                >
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-700 text-center">
                        Update Group
                    </h1>

                    {/* Group Icon and Details */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            {/* <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <i className="fas fa-camera text-2xl"></i>
              </div> */}
                            <div className="flex flex-col w-full space-y-3">
                                {/* Group Name Input */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter group name"
                                        className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Group Description Input */}
                                <div>
                                    <textarea
                                        placeholder="Enter group description"
                                        className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
                                        rows={3}
                                        {...register("description")}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-medium py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Update Group
                        </button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
