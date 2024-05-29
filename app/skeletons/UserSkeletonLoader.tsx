import React from 'react';

const UserSkeletonLoader: React.FC = () => {
    return (
        <div className="animate-pulse flex flex-col space-y-4">
            Loading ...
            <div className="h-4 bg-gray-200 rounded">...</div>
            <div className="h-4 bg-gray-200 rounded">...</div>
            <div className="h-4 bg-gray-200 rounded">...</div>
            <div className="h-4 bg-gray-200 rounded">...</div>
            <div className="h-4 bg-gray-200 rounded">...</div>
        </div>
    );
};

export default UserSkeletonLoader;
