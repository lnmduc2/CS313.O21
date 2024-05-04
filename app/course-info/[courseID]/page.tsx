'use client';
import { useRouter } from 'next/navigation';
import { renderFieldValue } from '@/utils/util-functions';
import { useContext, useEffect } from 'react';
import { PageContext } from '@/app/layout';
import { Course } from '@/app/types';
import { link } from 'fs';
import { Suspense } from 'react';

import VideoTable from '@/components/VideoTable';
import ExerciseTable from '@/components/ExerciseTable';
import CourseInfoSkeletonLoader from '@/app/skeletons/CourseInfoSkeletonLoader';

export default function Home() {
    let { courseID, courseList, setCourseList } = useContext(PageContext);
    const router = useRouter();
    let course: Course = courseList?.[0] ?? undefined;
    console.log(course?.exercises ?? ['temp']);
    useEffect(() => {
        // Hàm fetch course tương ứng với state courseID
        const fetchCourse = async () => {
            if (courseID) {
                const response = await fetch(
                    `http://localhost:8000/course/id/${courseID}?detail=true`,
                );
                const responseJson = await response.json();
                setCourseList([responseJson]);
            }
        };

        fetchCourse();
    }, []);

    return (
        <div className="flex flex-row overflow-auto">
            <div className="flex flex-col px-16 py-4">
                <div>
                    <p className="font-bold py-4">Course Information</p>
                    <div className="grid grid-cols-2 gap-y-2 w-80">
                        <p className="font-semibold">Name</p>
                        <p>
                            {(() => {
                                let x = course?.name ?? '';
                                x = x === '' ? 'none' : x;
                                return x;
                            })()}
                        </p>

                        <p className="font-semibold">About</p>
                        <p>
                            {(() => {
                                let x = course?.about ?? '';
                                x = x === '' ? 'none' : x;
                                return x;
                            })()}
                        </p>

                        <p className="font-semibold">Prerequisites</p>
                        <p>
                            {(() => {
                                let x = course?.prerequisites ?? '';
                                x = x === '' ? 'none' : x;
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
                    </div>
                </div>
            </div>

            <div className="border-4 border-indigo-600 w-1 h-800 m-8"></div>

            <div className="flex flex-col justify-between items-center mb-4">
                <div>
                    <button
                        className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700"
                        onClick={() => router.back()}
                    >
                        Back
                    </button>
                </div>
                <div>
                    <p>Videos({course?.videos?.length ?? 0})</p>
                    <Suspense fallback={<CourseInfoSkeletonLoader />}>
                        {/* @ts-expect-error Server Component */}
                        <VideoTable />
                    </Suspense>
                </div>
                <div className="my-16">
                    <p>Exercises({course?.exercises?.length ?? 0})</p>
                    <Suspense fallback={<CourseInfoSkeletonLoader />}>
                        {/* @ts-expect-error Server Component */}
                        <ExerciseTable />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
