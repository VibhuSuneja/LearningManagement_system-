import React from 'react';

const CourseSkeleton = () => {
    return (
        <div className="w-[300px] h-[400px] bg-white rounded-[32px] overflow-hidden shadow-sm animate-pulse border border-gray-100 p-4">
            {/* Thumbnail Skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-2xl mb-6" />
            
            {/* Content Skeleton */}
            <div className="space-y-4 px-2">
                <div className="h-3 w-1/3 bg-gray-100 rounded-full" />
                <div className="h-5 w-full bg-gray-200 rounded-full" />
                <div className="h-5 w-2/3 bg-gray-200 rounded-full" />
                
                <div className="pt-6 flex items-center justify-between">
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                    <div className="h-8 w-24 bg-gray-900/10 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default CourseSkeleton;
