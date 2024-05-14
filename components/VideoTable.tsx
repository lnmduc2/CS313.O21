import { renderFieldValue } from "@/utils/util-functions";
import { useContext } from "react";
import { PageContext } from "@/app/layout";
import { Course, Video } from "@/app/types";

export default async function VideoTable() {
  const { courseList } = useContext(PageContext);
  const course: Course = courseList?.[0] ?? undefined;
  const videoList = course?.videos ?? [];

  return (
    <table className="min-w-full table-auto border-collapse text-left text-sm">
      <thead>
        <tr className="bg-purple-600 text-white">
          <th className="p-2 border-b-2 border-black-600">Title</th>
          <th className="p-2 border-b-2 border-black-600">Chapter</th>
        </tr>
      </thead>
      <tbody>
        {videoList &&
          videoList.map((video: Video, index: number) => (
            <tr
              key={video.id}
              className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
            >
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(video.title)}
              </td>
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(video.chapter)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}