import { User } from "@/app/types";
import { useRouter } from "next/navigation";
import { renderFieldValue } from "@/utils/util-functions";
import { useContext, useEffect, useState } from "react";
import { PageContext, IndexContext } from "@/app/layout";

export default function UserTable() {
  const router = useRouter();

  const {
    userID,
    setUserID,
    userName,
    userList,
    setUserList,
    setShowNoResultsModal,
  } = useContext(PageContext);

  const { isLoadingUsers, setIsLoadingUsers } = useContext(IndexContext);

  const handleNavigateToUserInfo = (userId: string) => {
    setUserID(userId);

    router.push(`/user-info/${userId}`);
  };

  useEffect(() => {
    // Kiểm tra xem isLoadingUsers đã chuyển từ false sang true hay không
    if (isLoadingUsers) {
      const fetchUserList = async (
        userID: string = "null",
        userName: string = "null"
      ): Promise<User[]> => {
        try {
          const requests = [];

          if (userID !== "") {
            requests.push(fetch(`http://localhost:8000/user/id/${userID}`));
          }

          if (userName !== "") {
            requests.push(fetch(`http://localhost:8000/user/name/${userName}`));
          }

          const responses = await Promise.all(requests);
          for (const response of responses) {
            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }
          }

          const results = await Promise.all(responses.map((res) => res.json()));

          return results.flat();
        } catch (error) {
          console.error(`Could not fetch API /user/: ${error}`);
          return [];
        }
      };

      const fetchData = async () => {
        const users: User[] = await fetchUserList(userID, userName);
        setUserList(users);
        if (users.length === 0) {
          setShowNoResultsModal(true);
        }
      };

      fetchData();
      setIsLoadingUsers(false);
    }
  }, [isLoadingUsers]);

  return (
    <table className="table-auto w-full">
      <thead className="sticky top-0 bg-purple-600 text-white">
        <tr className="bg-purple-600 text-white">
          <th className="p-2 border-b-2 border-black-600">User ID</th>
          <th className="p-2 border-b-2 border-black-600">Username</th>
          <th className="p-2 border-b-2 border-black-600">Gender</th>
          <th className="p-2 border-b-2 border-black-600">School</th>
          <th className="p-2 border-b-2 border-black-600">Year of Birth</th>
        </tr>
      </thead>
      <tbody>
        {userList &&
          userList.length > 0 &&
          userList.map((user: User, index: number) => (
            <tr
              key={user.id}
              className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"} hover:bg-green-300`}
              onClick={() => handleNavigateToUserInfo(user.id)}
            >
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(user.id)}
              </td>
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(user.name)}
              </td>
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(user.gender)}
              </td>
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(user.school)}
              </td>
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(user.year_of_birth)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
