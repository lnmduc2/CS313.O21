"use client";
import { renderFieldValue } from "@/utils/util-functions";
import { useContext, useEffect } from "react";
import { PageContext } from "@/app/layout";
import { Course } from "@/app/types";
import { link } from "fs";
import { Suspense } from "react";

import VideoTable from "@/components/VideoTable";
import ExerciseTable from "@/components/ExerciseTable";
import CourseInfoSkeletonLoader from "@/app/skeletons/CourseInfoSkeletonLoader";

export default function Home() {
  let { courseID, courseList, setCourseList } = useContext(PageContext);
  let course: Course = courseList?.[0] ?? undefined;
  console.log(course?.exercises ?? ["temp"]);
  useEffect(() => {
    // Hàm fetch course tương ứng với state courseID
    const fetchCourse = async () => {
      if (courseID) {
        const response = await fetch(
          `http://localhost:8000/course/id/${courseID}?detail=true`
        );
        const responseJson = await response.json();
        setCourseList([responseJson]);
      }
    };

    fetchCourse();
  }, []);

  return (
    <div className="flex flex-row justify-items-end w-full">
      <div className="flex flex-col px-2 py-2">
        <div>
          <p className="font-bold py-4">Course Information</p>
          <div className="grid grid-cols-2 gap-y-2 w-80">
            <p className="font-semibold">Name</p>
            <p>
              {(() => {
                let x = course?.name ?? "";
                x = x === "" ? "none" : x;
                return x;
              })()}
            </p>

            <p className="font-semibold">About</p>
            <p>
              {(() => {
                let x = course?.about ?? "";
                x = x === "" ? "none" : x;
                return x;
              })()}
            </p>

            <p className="font-semibold">Prerequisites</p>
            <p>
              {(() => {
                let x = course?.prerequisites ?? "";
                x = x === "" ? "none" : x;
                return x;
              })()}
            </p>

            <p className="font-semibold">Number of Users</p>
            <p>{course?.n_users ?? 0}</p>

            <p className="font-semibold">
              Schools({course?.schools?.length ?? 0})
            </p>
            <p>
              {course?.schools?.map((school, index) => (
                <li key={index} className="px-4">
                  {school}
                </li>
              )) ?? <li>None</li>}
            </p>

            <p className="font-semibold">
              Teachers({course?.teachers?.length ?? 0})
            </p>
            <p>
              {course?.teachers?.map((teacher, index) => (
                <li key={index} className="px-4">
                  {teacher.name}
                </li>
              )) ?? <li>None</li>}
            </p>

            <p className="font-semibold">
              Fields({course?.fields?.length ?? 0})
            </p>
            <p>
              {course?.fields?.map((field, index) => (
                <li key={index} className="px-4">
                  {field.name}
                </li>
              )) ?? <li>None</li>}
            </p>
          </div>
        </div>
      </div>

      <div className="border-4 border-indigo-600 w-1 h-full m-4"></div>

      <div className="w-full">
        <div className="flex flex-col my-8">
          <p>Videos({course?.videos?.length ?? 0})</p>
          <div className="max-h-56 overflow-y-scroll">
            <Suspense fallback={<CourseInfoSkeletonLoader />}>
              {/* @ts-expect-error Server Component */}
              <VideoTable />
            </Suspense>
          </div>
        </div>

        <div className="flex flex-col my-8">
          <p>Exercises({course?.exercises?.length ?? 0})</p>
          <div className="max-h-56 overflow-y-scroll">
            <Suspense fallback={<CourseInfoSkeletonLoader />}>
              {/* @ts-expect-error Server Component */}
              <ExerciseTable />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
