'use client';
import { useContext, useState, useEffect } from 'react';
import { PageContext } from '@/app/layout';
import { renderFieldValue } from '../../../utils/util-functions';
import { User } from '@/app/types';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

import CourseEnrolledTable from '@/components/CourseEnrolledTable';
import CourseTrendingTable from '@/components/CourseTrendingTable';
import CourseKgatTable from '@/components/CourseKgatTable';
import CourseBprmfTable from '@/components/CourseBprmfTable';

import CourseEnrolledSkeletonLoader from '../../../app/skeletons/CourseEnrolledSkeletonLoader';
import CourseTrendingSkeletonLoader from '../../../app/skeletons/CourseTrendingSkeletonLoader';
import CourseRecommendedSkeletonLoader from '../../../app/skeletons/CourseRecommendedSkeletonLoader';

export default function Home() {
    const { userList } = useContext(PageContext);
    const router = useRouter();

    let user: User = userList[0];

    return (
        <div className="overflow-auto">
            <div className="flex flex-row px-16 py-4 ">
                <div>
                    <p className="font-bold">User Information</p>
                    <div className="flex flex-row w-80">
                        <div>
                            <p>User ID:</p>
                            <p>User name: </p>
                            <p>Gender: </p>
                            <p>School: </p>
                            <p>Year of birth: </p>
                        </div>
                        <div className="px-2">
                            <p>{renderFieldValue(user.id)}</p>
                            <p>{renderFieldValue(user.name)}</p>
                            <p>{renderFieldValue(user.gender)}</p>
                            <p>{renderFieldValue(user.school)}</p>
                            <p>{renderFieldValue(user.year_of_birth)}</p>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-bold">Course Enrolled</h1>
                        <button
                            className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700"
                            onClick={() => router.back()}
                        >
                            Back
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <Suspense fallback={<CourseEnrolledSkeletonLoader />}>
                            {/* @ts-expect-error Server Component */}
                            <CourseEnrolledTable />
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className="border-4 border-indigo-600 h-1 m-8"></div>
            <div>
                <p className="font-bold mx-16 my-4">Recommend Courses</p>
                <div className="flex flex-row space-x-4">
                    <Suspense fallback={<CourseTrendingSkeletonLoader />}>
                        {/* @ts-expect-error Server Component */}
                        <CourseTrendingTable />
                    </Suspense>
                    <Suspense fallback={<CourseRecommendedSkeletonLoader />}>
                        {/* @ts-expect-error Server Component */}
                        <CourseKgatTable />
                    </Suspense>
                    <Suspense fallback={<CourseRecommendedSkeletonLoader />}>
                        {/* @ts-expect-error Server Component */}
                        <CourseBprmfTable />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
