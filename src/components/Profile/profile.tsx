import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { AuthLayout } from '../Layout/layout';
import UseFinanceHook from '@/hooks/UseFinance';

// Interface for user details
interface UserDetails {
  id: number;
  username: string;
  email: string;
  is_email_verified: number;
  is_admin: string;
  is_questionnaire_filled: string;
  first_name: string;
  last_name: string;
  other_name?: string;
  phone: string;
  kyc_status: string;
  user_pin: string;
  pin_active: string;
}

// Interface for followed items
interface FollowedItem {
  id: string;
  fitem_id: string;
  fitem_name: string;
  fitem_symbol: string;
  fitem_logo: string;
  fitem_type: string;
  fitem_description: string;
  user_id?: string;
  user_name?: string;
  created_at?: string;
  updated_at?: string;
}

const Profile = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'following'>('profile');
  const [error, setError] = useState<string | null>(null);

  const { getUserDetails, getItemFollowing, unfollowFinanceItem } = UseFinanceHook();

  // Fetch user details and followed items when component mounts
  useEffect(() => {
    fetchUserDetails();
    fetchFollowedItems();
  }, []);

  const fetchUserDetails = async () => {
    setLoadingProfile(true);
    setError(null);
    try {
      const response = await getUserDetails();
      
      if (response) {
        setUserDetails(response.data[0]);
      } else {
        setError('Failed to load user profile');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Error loading profile. Please try again.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchFollowedItems = async () => {
    setLoadingItems(true);
    try {
      const response = await getItemFollowing();
      
      // Handle different possible response formats
      if (response && Array.isArray(response.data)) {
        setFollowedItems(response.data);
      } else if (response && Array.isArray(response)) {
        setFollowedItems(response);
      } else if (response && response[0] && Array.isArray(response[0])) {
        setFollowedItems(response[0]);
      } else {
        console.warn('Unexpected followed items response format:', response);
        setFollowedItems([]);
      }
    } catch (error) {
      console.error('Error fetching followed items:', error);
      toast.error('Failed to load followed items');
    } finally {
      setLoadingItems(false);
    }
  };

  const handleUnfollow = async (itemId: string) => {
    if (window.confirm('Are you sure you want to unfollow this item?')) {
      setUnfollowingId(itemId);
      try {
        await unfollowFinanceItem(itemId);
        toast.success('Item unfollowed successfully');
        
        // Update local state to remove the unfollowed item
        setFollowedItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error unfollowing item:', error);
        toast.error('Failed to unfollow item');
      } finally {
        setUnfollowingId(null);
      }
    }
  };

  // Categorize followed items by type
  const stockItems = followedItems.filter(item => item.fitem_type.toLowerCase() === 'stock');
  const cryptoItems = followedItems.filter(item => item.fitem_type.toLowerCase() === 'crypto');

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-6">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                fetchUserDetails();
                fetchFollowedItems();
              }}
              className="text-sm font-medium underline mt-1"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'profile' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Details
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'following' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('following')}
          >
            Items Following ({followedItems.length})
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            {loadingProfile ? (
              <LoadingSpinner />
            ) : userDetails ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
                    <FiUser size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {userDetails.first_name} {userDetails.last_name}
                      {userDetails.other_name && ` ${userDetails.other_name}`}
                    </h2>
                    <p className="text-gray-500">@{userDetails.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                      <div className="flex items-center">
                        <FiMail className="text-gray-400 mr-2" />
                        <span>{userDetails.email}</span>
                        {userDetails.is_email_verified === 1 ? (
                          <span className="ml-2 text-green-500 flex items-center">
                            <FiCheckCircle size={14} className="mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="ml-2 text-amber-500 flex items-center">
                            <FiXCircle size={14} className="mr-1" /> Not Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                      <div className="flex items-center">
                        <FiPhone className="text-gray-400 mr-2" />
                        <span>{userDetails.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Account Status</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-500">KYC Status</span>
                          <div className="font-medium mt-1 flex items-center">
                            {userDetails.kyc_status === 'yes' ? (
                              <>
                                <FiCheckCircle className="text-green-500 mr-1" /> Verified
                              </>
                            ) : (
                              <>
                                <FiXCircle className="text-amber-500 mr-1" /> Not Verified
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-500">Questionnaire</span>
                          <div className="font-medium mt-1 flex items-center">
                            {userDetails.is_questionnaire_filled === 'yes' ? (
                              <>
                                <FiCheckCircle className="text-green-500 mr-1" /> Completed
                              </>
                            ) : (
                              <>
                                <FiXCircle className="text-amber-500 mr-1" /> Incomplete
                              </>
                            )}
                          </div>
                        </div>
                        
                       
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-500">User Type</span>
                          <div className="font-medium mt-1 capitalize">
                            {userDetails.is_admin === 'yes' ? 'Admin' : 'Regular User'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Profile information could not be loaded.</p>
                <button 
                  onClick={fetchUserDetails}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div>
            {loadingItems ? (
              <LoadingSpinner />
            ) : followedItems.length === 0 ? (
              <div className="text-center py-10 bg-white shadow-sm rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-2">You are not following any finance items yet.</p>
                <p className="text-sm text-gray-400">
                  Follow stocks or cryptocurrencies to track them and get updates.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {stockItems.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Stocks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stockItems.map(item => (
                        <div 
                          key={item.id} 
                          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            {item.fitem_logo && (
                              <img 
                                src={item.fitem_logo} 
                                alt={item.fitem_name} 
                                className="w-12 h-12 object-contain rounded mr-3"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{item.fitem_name}</h3>
                                  <span className="text-sm text-gray-500">{item.fitem_symbol}</span>
                                </div>
                                <button
                                  onClick={() => handleUnfollow(item.id)}
                                  disabled={unfollowingId === item.id}
                                  className={`p-1 text-gray-400 hover:text-red-500 ${unfollowingId === item.id ? 'opacity-50' : ''}`}
                                  title="Unfollow"
                                >
                                  {unfollowingId === item.id ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                                  ) : (
                                    <FiTrash2 size={16} />
                                  )}
                                </button>
                              </div>
                              <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                                {item.fitem_description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cryptoItems.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Cryptocurrencies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cryptoItems.map(item => (
                        <div 
                          key={item.id} 
                          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            {item.fitem_logo && (
                              <img 
                                src={item.fitem_logo} 
                                alt={item.fitem_name} 
                                className="w-12 h-12 object-contain rounded mr-3"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{item.fitem_name}</h3>
                                  <span className="text-sm text-gray-500">{item.fitem_symbol}</span>
                                </div>
                                <button
                                  onClick={() => handleUnfollow(item.id)}
                                  disabled={unfollowingId === item.id}
                                  className={`p-1 text-gray-400 hover:text-red-500 ${unfollowingId === item.id ? 'opacity-50' : ''}`}
                                  title="Unfollow"
                                >
                                  {unfollowingId === item.id ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                                  ) : (
                                    <FiTrash2 size={16} />
                                  )}
                                </button>
                              </div>
                              <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                                {item.fitem_description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Profile;