import { AuthLayout } from "@/components/Layout/layout";
import UseFinanceHook from "@/hooks/UseFinance";
import { createGroupValues } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

export default function CreateGroupPage() {
  const { CreateGroup } = UseFinanceHook();
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
      CreateGroup(data),
      {
        pending: "Creating group...",
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

//   const contacts = [
//     { id: 1, name: "John Doe" },
//     { id: 2, name: "Jane Smith" },
//     { id: 3, name: "Alice Brown" },
//     // Add more contacts as needed
//   ];

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        {/* Form Wrapper */}
        <form
          onSubmit={handleSubmit(SubmitForm)}
          className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 space-y-6"
        >
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-700 text-center">
            Create a New Group
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

          {/* Participant Selection */}
          <div className="space-y-4">
           
            {/* <ul className="max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-gray-50 p-3 space-y-2">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex items-center justify-between bg-white p-3 rounded shadow-sm cursor-pointer hover:bg-gray-100"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{contact.name}</p>
                  </div>
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600 rounded focus:ring focus:ring-blue-300"
                  />
                </li>
              ))}
            </ul> */}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
