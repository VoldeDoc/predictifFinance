import axiosClient from "@/services/axios-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMembersValues, AssignMemberRoleValues, createGroupValues, createStrategyValues, deleteMessageValues, editMessageValues, KycData, sendMessageValues, SurveyDataValues ,  } from "@/types";
import { toast } from "react-toastify";
import { RootState } from "@/context/store/rootReducer";
import { useSelector } from "react-redux";

const UseFinanceHook = () => {
    const client = axiosClient();
    const [loading, setLoading] = useState(false);
    const router = useNavigate();
        const userdata = useSelector((state: RootState) => state.auth?.user);

        const username = userdata?.username;

    const SubmitSurveyQuestion = async (data: SurveyDataValues) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to change password");
            }
            setLoading(true);
            const response = await client.post("/user/investQuestionnaire", data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            })
            console.log(response.data);
            router("/dashboard");
            return Promise.resolve("Survey submitted successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to submit survey");
        }
        finally {
            setLoading(false);
        }
    }

    const getUserDetails = async () => {
        try { 
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to change password");
            }
            setLoading(true);
            const response = await client.get("/getUserDetails", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            })
            return Promise.resolve(response.data);
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to submit survey");
        }
        finally {
            setLoading(false);
        }
    }

  const SubmitKyc = async (data: KycData) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required for KYC submission");
            }
            
            // Create FormData to properly handle file upload
            const formData = new FormData();
            
            // Add each KYC item to the formData with the proper array index notation
            data.kyc.forEach((item, index) => {
                if (item.type === 'file' && item.value instanceof File) {
                    formData.append(`kyc[${index}][${item.key}]`, item.value);
                    formData.append(`kyc[${index}][type]`, item.type);
                } else if (item.type === 'text') {
                    formData.append(`kyc[${index}][${item.key}]`, item.value.toString());
                    formData.append(`kyc[${index}][type]`, item.type);
                }
            });
            
            setLoading(true);
            const response = await client.post("/user/kycuser", formData, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log("KYC submission successful:", response.data);
            router("/dashboard");
            return Promise.resolve("KYC completed successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.error("KYC submission error:", errorMessage, error);
            return Promise.reject(errorMessage || "Failed to submit KYC");
        }
        finally {
            setLoading(false);
        }
    };


    const CreateGroup = async (data: createGroupValues) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to create group");
            }
            
            setLoading(true);
            const group = await client.post("/forum/groups", data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            const result = group.data.data;
            console.log(result);
            router(`/forum/messages/${result.id}`);
            return Promise.resolve("Group created successfully!");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage =
                resError?.message || resError?.data ;
            console.log(errorMessage);
            return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const getUserGroupById = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to access group");
            }
            
            setLoading(true);
            const group = await client.get(`/forum/groups/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            const result = group.data.data;
            return result
        } catch (error: any) {
            const resError = error.response?.data;
            console.log(resError.status);
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            if (resError?.status === 403) {
                router("/dashboard");
                toast.error(`${errorMessage}`);
            }
            console.log(errorMessage);
            //   return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    const getGroupUsers = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to access group users");
            }
            
            setLoading(true);
            const users = await client.get(`/forum/groups/${id}/users`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            const result = users.data.data;
            return result;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.log(errorMessage);
            return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    const getAllGroups = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to access groups");
            }
            
            setLoading(true);
            const allgroups = await client.get("/forum/groups", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            return allgroups.data.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.log(errorMessage);
            return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    const updateGroup = async (id: number, data: createGroupValues) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to update group");
            }
            
            setLoading(true);
            const group = await client.put(`/forum/groups/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            const result = group.data.data;
            console.log(result);
            router(`/forum/messages/${result.id}`);
            return Promise.resolve("Group updated successfully!");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage =
                resError?.message || resError?.data || "An error occurred";
            console.log(errorMessage);
            return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    const deleteGroup = async (id: number) => {
        try {
            setLoading(true);
            const group = await client.delete(`/forum/groups/${id}`);
            const result = group.data.data;
            console.log(result);
            router(`/forum`);
            return Promise.resolve("Group deleted successfully!");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage =
                resError?.message || resError?.data || "An error occurred";
            console.log(errorMessage);
            return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    const leaveGroup = async (groupId: number) => {
        try {
            setLoading(true);
            const group = await client.post(`/forum/groups/users/leave`, { group_id: groupId });
            const result = group.data.data;
            console.log(result);
            router(`/forum`);
            return Promise.resolve("You have left the group!");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage =
                resError?.message || resError?.data || "An error occurred";
            console.log(errorMessage);
            return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    const sendMessage = async (data: sendMessageValues) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to send message");
            }
            
            setLoading(true);
            const sentMessage = await client.post('/forum/messages/send', data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            const res = sentMessage.data.data;
            console.log(res);
            return res;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.log(errorMessage);
            return Promise.reject(errorMessage);
        } finally {
            setLoading(false);
        }
    }


    const getMessage = async (group_Id: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to access messages");
            }
            
            setLoading(true);
            const response = await client.get(`/forum/messages`, { 
                params: { group_id: group_Id },
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            const result = response.data?.data || [];
            return result;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error("Error fetching messages:", errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const EditMessage = async (data: editMessageValues) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to edit message");
            }
            
            setLoading(true);
            const response = await client.post('/forum/messages/edit', data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            const result = response.data?.data;
            return result;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error("Error editing message", errorMessage);
            return Promise.reject(errorMessage);
        } finally {
            setLoading(false);
        }
    }


    // const DeleteMessage = async (data) => {
    //     try {
    //         setLoading(false)
    //         const delsms = await client.delete('/forum/messages/delete',data)
    //     }
    //     catch {

    //     }
    // }


    const LockChat = async (group_Id: number) => {
        try {
            setLoading(true)
            const locked = await client.post('/forum/groups/close-chat', { group_id: group_Id })
            const result = locked.data?.data
            console.log(result)
            return result
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occured"
            console.error("Error editing message", errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const OpenChat = async (group_id: number) => {
        try {
            setLoading(true)
            const OpenChat = await client.post("/forum/groups/reopen-chat", { group_id: group_id })
            const result = OpenChat.data?.data
            return result
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occured"
            console.error("Error editing message", errorMessage)
        }
        finally {
            setLoading(false)
        }
    }


    const getAllUsers = async () => {
        try {
            setLoading(true)
            const getUser = await client.get("/listusers")
            const res = getUser.data?.data
            return res
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occured"
            console.error("Error getting users", errorMessage)
        }
        finally {
            setLoading(false)
        }

    }

    const AddUserToGroup = async (data: addMembersValues) => {
        try {
            setLoading(true)
            const addUser = await client.post("/forum/groups/users", data)
            const res = addUser.data?.data
            console.log(res);
            router(`/forum/messages/${data.group_id}`)
            return Promise.resolve(`Users Added to group ${data.group_id}`)
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occured"
            console.error("Error getting users", errorMessage)
        }
        finally {
            setLoading(false)
        }
    }

    const AssignRole = async (data: AssignMemberRoleValues) => {
        try {
            setLoading(true);
            const assignRole = await client.post("/forum/groups/role/users", data);
            const res = assignRole.data?.data;
            router(`/user/all-users/${data.group_id}`);
            console.log(res);
            return Promise.resolve(`Role assigned to user`);
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error("Error assigning roles", errorMessage);
            return Promise.reject(`${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };


    const RemoveUserFromGroup = async (data: addMembersValues) => {
        try {
            setLoading(true)
            const removeUser = await client.delete("/forum/groups/users/remove", { data })
            const res = removeUser.data?.data
            console.log(res);
            router(`/forum/messages/${data.group_id}`)
            return Promise.resolve(`Users removed from group ${data.group_id}`)
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occured"
            console.error("Error getting users", errorMessage)
            return Promise.reject(`${errorMessage}`)
        }
        finally {
            setLoading(false)
        }
    }

    const deleteMessage = async (data: deleteMessageValues) => {
        try {
            setLoading(true);
            const response = await client.delete("/forum/messages/delete", { data });
            const result = response?.data.data;
            return result;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error("Error deleting message:", errorMessage);
        } finally {
            setLoading(false);
        }
    }


    const getStrategyItem = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to access strategy items");
            }
            
            setLoading(true);
            const res = await client.get('/user/getStrategyItem', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    const createStrategies = async (data: createStrategyValues) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to create strategy");
            }
            
            setLoading(true);
            const res = await client.post('/user/strategiesCreate', data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            console.log(res.data);
            router('/strategies');
            return Promise.resolve("Strategy created successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(`${errorMessage}`);
        }
        finally {
            setLoading(false);
        }
    }

    const updateStrategies = async (data: createStrategyValues) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to update strategy");
            }
            
            setLoading(true);
            const res = await client.post('/user/strategiesUpdate', data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            console.log(res.data);
            router('/strategies');
            return Promise.resolve("Strategy updated successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(`${errorMessage}`);
        }
        finally {
            setLoading(false);
        }
    }

    const getMyStrategies = async (type: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to access strategies");
            }
            
            setLoading(true);
            const res = await client.get(`/user/getMyStrategy/${type}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(`${errorMessage}`);
        }
        finally {
            setLoading(false);
        }
    }

    const deleteStrategies = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to delete strategy");
            }
            
            setLoading(true);
            await client.get(`/user/deleteMyStrategy/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            return Promise.resolve("Strategy deleted successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(`${errorMessage}`);
        }
        finally {
            setLoading(false);
        }
    }


    const getFinanceItem = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to access finance items");
            }
            
            setLoading(true);
            const res = await client.get('/user/financialItem', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

 // Update the FollowFinanceItem function
const FollowFinanceItem = async (data: { item: string }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            router("/auth/signup");
            return Promise.reject("Authentication required to follow finance item");
        }
        
        setLoading(true);
        const res = await client.post('/user/submitSelection', data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        });
        console.log(res.data);
        return Promise.resolve("Finance item followed successfully");
    }   
    catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data || "An error occurred";
        console.error(errorMessage);
        return Promise.reject(`${errorMessage}`);
    }
    finally {
        setLoading(false);
    }
}
    const getItemFollowing = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to access followed items");
            }
            
            setLoading(true);
            const res = await client.get('/user/getItemFollowing', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            return res?.data?.data;
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }
   
    const unfollowFinanceItem = async (itemId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to unfollow finance item");
            }
            
            setLoading(true);
            const res = await client.get(`/user/unfollowingItem/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });
            console.log(res.data);
            return Promise.resolve("Finance item unfollowed successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data || "An error occurred";
            console.error(errorMessage);
            return Promise.reject(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }
    

    return {
        loading,
        SubmitSurveyQuestion,
        getUserDetails,
        SubmitKyc,
        CreateGroup,
        getUserGroupById,
        getGroupUsers,
        getAllGroups,
        updateGroup,
        deleteGroup,
        leaveGroup,
        sendMessage,
        getMessage,
        EditMessage,
        LockChat,
        OpenChat,
        getAllUsers,
        AddUserToGroup,
        AssignRole,
        RemoveUserFromGroup,
        deleteMessage,
        username,
        getStrategyItem,
        createStrategies,
        updateStrategies,
        getMyStrategies,
        deleteStrategies,
        getFinanceItem,
        FollowFinanceItem,
        getItemFollowing,
        unfollowFinanceItem

    }

}



export default UseFinanceHook;