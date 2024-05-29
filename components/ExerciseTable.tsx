import { renderFieldValue } from "@/utils/util-functions";
import { useContext } from "react";
import { PageContext } from "@/app/layout";
import { Course, Exercise } from "@/app/types";

export default async function ExerciseTable() {
  const { courseList } = useContext(PageContext);
  const course: Course = courseList?.[0] ?? undefined;
  const exerciseList = course?.exercises ?? [];

  return (
    <table className="min-w-full table-auto border-collapse text-left text-sm">
      <thead className="sticky top-0 bg-purple-600 text-white">
        <tr className="bg-purple-600 text-white">
          <th className="p-2 border-b-2 border-black-600">Title</th>
          <th className="p-2 border-b-2 border-black-600">Chapter</th>
        </tr>
      </thead>
      <tbody>
        {exerciseList &&
          exerciseList.map((exercise: Exercise, index: number) => (
            <tr
              key={exercise.id}
              className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
            >
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(exercise.title)}
              </td>
              <td className="p-2 border-b border-gray-200">
                {renderFieldValue(exercise.chapter)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
