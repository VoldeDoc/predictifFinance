import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "flowbite-react";
import UseFinanceHook from "@/hooks/UseFinance";

const NewsForum = () => {
  const { getAllGroups } = UseFinanceHook();
  const [groups, setGroups] = useState<{ id: number; name: string; description: string; img?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 5;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getAllGroups();
        console.log(fetchedGroups);
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {loading ? (
        <p className="text-center items-center text-xl font-bold">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="text-center items-center text-xl font-bold">No groups found. Click "Create Group" to add one.</p>
      ) : (
        <>
          {currentGroups.map((group) => (
            <Link to={`/forum/messages/${group.id}`} key={group.id}>
              <div className="bg-white cursor-pointer flex flex-row flex-wrap lg:flex-nowrap rounded-xl space-x-4 mt-5 px-4 py-5 hover:bg-black-400 transition-transform duration-300 transform hover:scale-105">
                <div>
                  {group.img ? (
                    <img src={group.img} alt="Group Image" width={150} height={150} />
                  ) : (
                    <div className="bg-gray-300 flex items-center justify-center rounded-lg" style={{ width: 150, height: 150 }}>
                      <span className="text-6xl font-bold">{group.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col ">
                  <p className="font-semibold text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                    {group.name}
                  </p>
                  <p className="font-medium text-base overflow-hidden text-ellipsis whitespace-nowrap">
                    {group.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {groups.length > groupsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(groups.length / groupsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NewsForum;