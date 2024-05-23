import { Course } from "@/app/types";
import { useRouter } from "next/navigation";
import { renderFieldValue } from "@/utils/util-functions";
import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "@/app/layout";

export default async function CourseTrendingTable(): Promise<JSX.Element> {
  const [courseTrendingList, setCourseTrendingList] = useState<Course[]>([]);

  const { userID, setUserID, userList } = useContext(PageContext);
  const { setCourseID } = useContext(PageContext);

  // Hàm xử lí event navigate sang course-info/{courseID}
  const router = useRouter();

  const handleNavigateToCourseInfo = (courseId: string) => {
    router.push(`/course-info/${courseId}`);
    setCourseID(courseId); // Lưu trữ courseID vào global context
  };

  useEffect(() => {
    // Hàm fetch list trending courses
    const fetchTrendingCourses = async () => {
      const response = await fetch(`http://localhost:8000/course/popular`);
      const responseJson = await response.json();
      setCourseTrendingList(responseJson);
    };

    fetchTrendingCourses();
  }, []);

  return (
    <table className="table-auto w-full">
      <thead className="sticky top-0 bg-purple-600 text-white">
        <tr className="bg-purple-600 text-white">
          <th className="p-2 border-b-2 border-black-600">Name</th>
          <th className="p-2 border-b-2 border-black-600">Schools</th>
          <th className="p-2 border-b-2 border-black-600">Number of users</th>
        </tr>
      </thead>
      <tbody>
        {courseTrendingList.map((course, index) => (
          <tr
            key={index}
            className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"} hover:bg-green-300`}
            onClick={() => handleNavigateToCourseInfo(course.id)}
          >
            <td className="px-4 py-2">{renderFieldValue(course.name)}</td>
            <td className="px-4 py-2">
              {renderFieldValue(course.schools.join(", "))}
            </td>
            <td className="px-4 py-2">{renderFieldValue(course.n_users)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
