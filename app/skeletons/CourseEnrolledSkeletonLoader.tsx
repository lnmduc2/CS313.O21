import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CourseEnrolledSkeletonLoader: React.FC = () => {
    return (
        <SkeletonTheme
            baseColor="#5294e0"
            highlightColor="#96c7ff"
            borderRadius="0.5rem"
            duration={4}
        >
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-purple-600 text-white">
                        <th className="p-2 border-b-2 border-black-600">
                            Course name
                        </th>
                        <th className="p-2 border-b-2 border-black-600">
                            School
                        </th>
                        <th className="p-2 border-b-2 border-black-600">
                            Time
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map(
                        (
                            _,
                            index, // Tạo ra 5 hàng
                        ) => (
                            <tr key={index}>
                                <td>
                                    <Skeleton />{' '}
                                </td>
                                <td>
                                    <Skeleton />{' '}
                                </td>
                                <td>
                                    <Skeleton />{' '}
                                </td>
                            </tr>
                        ),
                    )}
                </tbody>
            </table>
        </SkeletonTheme>
    );
};

export default CourseEnrolledSkeletonLoader;
