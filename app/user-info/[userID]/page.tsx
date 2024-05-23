'use client';
import { useContext, useState, useEffect } from 'react';
import { PageContext } from '@/app/layout';
import { renderFieldValue } from '../../../utils/util-functions';
import { User } from '@/app/types';
import { Suspense } from 'react';

import CourseEnrolledTable from '@/components/CourseEnrolledTable';
import CourseTrendingTable from '@/components/CourseTrendingTable';
import CourseKgatTable from '@/components/CourseKgatTable';

import CourseEnrolledSkeletonLoader from '../../../app/skeletons/CourseEnrolledSkeletonLoader';
import CourseTrendingSkeletonLoader from '../../../app/skeletons/CourseTrendingSkeletonLoader';
import CourseRecommendedSkeletonLoader from '../../../app/skeletons/CourseRecommendedSkeletonLoader';

export default function Home() {
    const { userList, setUserList, userID } = useContext(PageContext);
    const userListCopy = [...userList];

    // Filter the copy of userList
    const userListFiltered = userListCopy.filter(
        (user: User) => user.id === userID,
    );

    let user: User = userListFiltered[0];

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
                    <p className="font-bold">Enrolled Courses</p>
                    <div className="overflow-x-auto max-h-56 overflow-y-scroll">
                        <Suspense fallback={<CourseEnrolledSkeletonLoader />}>
                            {/* @ts-expect-error Server Component */}
                            <CourseEnrolledTable />
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className="border-4 border-indigo-600 h-1 m-8"></div>
            <div>
                <div className="flex flex-row space-x-4">
                    <div className="flex flex-col">
                        <p className="font-bold">Trending courses</p>
                        <div className="max-h-56 overflow-y-scroll">
                            <Suspense
                                fallback={<CourseTrendingSkeletonLoader />}
                            >
                                {/* @ts-expect-error Server Component */}
                                <CourseTrendingTable />
                            </Suspense>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">Courses you may like</p>
                        <div className="max-h-56 overflow-y-scroll">
                            <Suspense
                                fallback={<CourseRecommendedSkeletonLoader />}
                            >
                                {/* @ts-expect-error Server Component */}
                                <CourseKgatTable />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
