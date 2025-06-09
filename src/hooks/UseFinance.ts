import axiosClient from "@/services/axios-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMembersValues, AssignMemberRoleValues, createGroupValues, createStrategyValues, deleteMessageValues, editMessageValues, KycData, sendMessageValues, SurveyDataValues, } from "@/types";
import { toast } from "react-toastify";
import { RootState } from "@/context/store/rootReducer";
import { useSelector } from "react-redux";
import axios from "axios";
import type { Stripe, StripeCardElement } from "@stripe/stripe-js";

export interface BudgetPlanPayload {
    label: string;
    budget_amount: string;
    detail?: string;
    startDate?: string;
    endDate?: string;
}

// let stripePromise: Promise<Stripe | null> | null = null;
// function getStripe() {
//   if (!stripePromise) {
//     // ← Replace with your real Stripe publishable key:
//     stripePromise = loadStripe("pk_test_51QfeEiJPjkyacDG1OLhLDqppvm1eMOROsU1daEGZkPnMKEGdNirwh4dSIxDE5v70EEhPo0Hhf2DoaHnkM9uMaWKm00g3E9yAFi");
//   }
//   return stripePromise;
// }

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
                resError?.message || resError?.data;
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


    // UPDATED (fixed) signature:
    const getChartData = async (
        symbol: string,
        _resolution: string = "D",
        _from?: number,
        _to?: number
    ): Promise<{ x: number; y: number }[]> => {
        setLoading(true);
        try {
            const apiKey = "SLINNRNUBVZ04IKX";
            const response = await axios.get("/alpha/query", {
                params: {
                    function: "TIME_SERIES_DAILY",
                    symbol,
                    apikey: apiKey,
                    outputsize: "compact",
                },
            });

            const timeSeries = response.data["Time Series (Daily)"];
            if (!timeSeries) return [];

            // (Optional) If you want to filter by `from`/`to`, you could do it here,
            // but the call below simply ignores them and returns the full reversed series.
            const result = Object.entries(timeSeries).map(([date, value]: any) => ({
                x: new Date(date).getTime(),
                y: parseFloat(value["4. close"])
            }));

            return result.reverse();
        }
        catch (err: any) {
            console.error("Error fetching chart data for", symbol, err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getStockMeta = async (symbol: string) => {
        setLoading(true);
        try {
            const apiKey = "SLINNRNUBVZ04IKX";
            const res = await axios.get("/alpha/query", {
                params: {
                    function: "OVERVIEW",
                    symbol,
                    apikey: apiKey,
                },
            });
            return res.data;
        } catch (err) {
            console.error("Error fetching stock overview for", symbol, err);
            return null;
        } finally {
            setLoading(false);
        }
    };


    const getBudgetPlans = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Unauthorized");
            setLoading(true);
            const response = await client.get('/user/budgetget', {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` }
            });
            // response.data.data is the array of plans
            return response.data.data;
        } catch (err: any) {
            console.error("Error fetching budget plans:", err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createBudgetPlan = async (
        data: BudgetPlanPayload
    ): Promise<any> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");
            setLoading(true);
            const response = await client.post(
                "/user/budgetCreate",
                data,
                { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
            );
            return response.data.data;
        } catch (err: any) {
            console.error("Error creating budget plan:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateBudgetPlan = async (data: {
        id: string;
        label: string;
        budget_amount: string;
        detail?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");
            setLoading(true);
            const res = await client.post('/user/budgetUpdate', data,
                {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` }
                }
            );
            return res.data.data; // true on success
        } catch (err: any) {
            console.error('Error updating budget plan', err);
            return Promise.reject(err);
        }
    };

    // DELETE /user/budgetDelete/:id
    const deleteBudgetPlan = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Unauthorized");
            const res = await client.get(`/user/budgetDelete/${id}`,
                {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` }
                });
            // res.data.data contains the deleted record
            return res.data.data;
        } catch (err: any) {
            console.error('Error deleting budget plan', err);
            return Promise.reject(err);
        }
    };

    const getBudgetSummary = async (): Promise<{
        budgetamount: number;
        income: number;
        expense: number;
    }> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Unauthorized");
            setLoading(true);
            const res = await client.get("/user/budgetsummary",
                {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` }
                }
            );
            // API shape: { status, message, data: { budgetamount, income, expense } }
            return res.data.data;
        } catch (err: any) {
            console.error("Error fetching budget summary", err);
            return Promise.reject(err);
        }
    };

    const getExpenseCategories = async (): Promise<{ category: string; total_amount: number }[]> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Unauthorized");
            setLoading(true);
            const res = await client.get("/user/budgetsummaryExpense", {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            });
            // API: { status, message, data: [ { category, total_amount } ] }
            return res.data.data;
        } catch (err: any) {
            console.error("Error fetching expense categories", err);
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    };


    const getIncomeCategories = async (): Promise<{ category: string; total_amount: number }[]> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Unauthorized");
            setLoading(true);
            const res = await client.get("/user/budgetsummaryIncome", {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            });
            return res.data.data;
        } catch (err: any) {
            console.error("Error fetching income categories", err);
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    };

    const getBudgetPeriods = async () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");
        const res = await client.get("/user/budgetget", {
            headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        });
        return res.data.data as {
            id: string;
            label: string;
            budget_amount: number;
            startDate: string | null;
            endDate: string | null;
        }[];
    };

    const createBudgetItem = async (payload: {
        plan_id: string;
        category: string;
        item: string;
        amount: string;
        source: "income" | "expense";
        date: string;
    }) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");
        const res = await client.post("/user/budgetItemCreate", payload, {
            headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        });
        return res.data.data;
    };

    // 1) Create the deposit record first
    const createDepositAction = async (
        amount: number
    ): Promise<{ id: string; ref: string; type: string }> => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const resp = await client.post(
            "/user/deposit",
            { amount, detail: "" },
            { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
        );
        return resp.data.data as { id: string; ref: string; type: string };
    };

    // 2) Create Stripe PaymentIntent, passing amount + the deposit `ref`
    const createStripePaymentIntent = async (
        amount: number,
        depositRef: string
    ): Promise<string> => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const resp = await client.post(
            "/payment/stripe-payment-intent",
            { amount, reference: depositRef },
            { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
        );
        const { clientSecret } = resp.data as { clientSecret: string };
        if (!clientSecret) throw new Error("No clientSecret returned");
        return clientSecret;
    };

    // 3) Tell your backend “Stripe payment succeeded,” passing the PI ID
    const confirmStripePaymentOnBackend = async (
        action: string,
        payment_intent_id: string
    ) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        await client.post(
            "/payment/stripe-payment-confirm",
            { payment_intent_id, action },
            { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
        );
    };

    // 4) Glue it all together
    const topUp = async (
        stripe: Stripe,
        cardElement: StripeCardElement,
        amount: number
    ) => {
        try {
            // A) Create deposit record and grab its id/ref/type
            const { ref: depositRef, type: action } =
                await createDepositAction(amount);
            console.log("Created deposit action:", { depositRef, action });

            // B) Ask backend for a PaymentIntent, passing depositRef
            const clientSecret = await createStripePaymentIntent(amount, depositRef);
            console.log("Got clientSecret:", clientSecret);

            // C) Confirm card payment in the browser
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                { payment_method: { card: cardElement } }
            );
            if (error) {
                console.error("Stripe confirmCardPayment error:", error);
                throw error;
            }
            if (!paymentIntent) {
                throw new Error("No PaymentIntent returned after confirmCardPayment");
            }
            console.log("Confirmed PaymentIntent:", paymentIntent.id);

            // D) Notify backend that payment succeeded
            await confirmStripePaymentOnBackend(
                action,
                paymentIntent.id
            );

            console.log("Top-up completed successfully!");
        } catch (err) {
            console.error("Top-up failed:", err);
            throw err;
        }
    };



    // const topUp = async (
    //     stripe: Stripe,
    //     cardElement: StripeCardElement,
    //     amount: number
    //   ) => {
    //     try {
    //       // (A) Ask our backend to create a PaymentIntent and return its clientSecret:
    //       const clientSecret = await createStripePaymentIntent(amount);
    //       console.log("clientSecret from backend:", clientSecret);

    //       // (B) Confirm the payment in the browser:
    //       const { error, paymentIntent: partialPI } = await stripe.confirmCardPayment(
    //         clientSecret,
    //         { payment_method: { card: cardElement } }
    //       );

    //       if (error) {
    //         console.error("Stripe confirmCardPayment error:", error);
    //         throw error;
    //       }
    //       if (!partialPI) {
    //         throw new Error("No PaymentIntent returned after confirmCardPayment");
    //       }
    //       console.log("confirmed PaymentIntent (no need to expand yet):", partialPI);

    //       // (C) Retrieve that same PaymentIntent again (this time we get the fully populated object).
    //       //     stripe.retrievePaymentIntent only takes a single argument (the clientSecret),
    //       //     so we must not pass a second “expand” parameter here.
    //       const { paymentIntent: fullPI } = await stripe.retrievePaymentIntent(clientSecret);

    //       if (!fullPI) {
    //         throw new Error("Unable to retrieve the full PaymentIntent");
    //       }
    //       console.log("fetched full PaymentIntent:", fullPI);

    //       // (D) Pull out the Charge ID from fullPI.charges.data[0].id.
    //       //     We have to cast to `any` because TypeScript’s built-in `PaymentIntent` type
    //       //     does not include `.charges`.
    //       const chargeList = (fullPI as any).charges?.data;
    //       const chargeId = Array.isArray(chargeList) && chargeList[0]?.id;
    //       if (!chargeId) {
    //         throw new Error("No charge ID available on this PaymentIntent");
    //       }
    //       console.log("Charge ID to send to backend:", chargeId);

    //       // (E) Create the “deposit” record in our system so we know action_id & action type
    //       const { id: action_id, type: action } = await createDepositAction(amount);

    //       // (F) Tell our backend “Stripe payment succeeded,” passing the Charge ID from step (D)
    //       await confirmStripePaymentOnBackend(action_id, action, chargeId);

    //       // If you need to show any success message client-side, do it here.
    //     } catch (err) {
    //       console.error("Top-up failed:", err);
    //       throw err;
    //     }
    //   };



    const getDepositTransactions = async () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await client.get("/user/gettransactions/deposit", {
            headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        });
        // res.data.data is the array of raw transactions
        return res.data.data as Array<{
            id: string;
            ref: string;
            amount: number;
            detail: string | null;
            type: string;       // e.g. "deposit"
            status: string;     // e.g. "pending", "completed", etc.
            item_id: string | null;
            user_ref_id: string;
            created_at: string; // ISO timestamp, e.g. "2025-06-03T21:05:17.000000Z"
            updated_at: string;
        }>;
    };


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
        unfollowFinanceItem,
        getChartData,
        getBudgetPlans,
        createBudgetPlan,
        updateBudgetPlan,
        deleteBudgetPlan,
        getBudgetSummary,
        getExpenseCategories,
        getIncomeCategories,
        getBudgetPeriods,
        createBudgetItem,
        getStockMeta,
        createStripePaymentIntent,
        confirmStripePaymentOnBackend,
        createDepositAction,
        topUp,
        getDepositTransactions,
    }

}



export default UseFinanceHook;