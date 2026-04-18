import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import CourseSkeleton from './CourseSkeleton';
import { FaGraduationCap } from 'react-icons/fa';

function CardPage() {
  const { courseData } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseData) {
      setPopularCourses(Array.isArray(courseData) ? courseData.slice(0, 6) : []);
      setLoading(false);
    }
  }, [courseData]);

  return (
    <div className='w-full py-20 px-6 bg-[#f8fafc]'>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-black text-black uppercase tracking-tighter leading-none'>
            Our Popular<br />
            <span className="text-gray-300">Courses</span>
          </h1>
          <p className='text-gray-500 font-medium text-lg max-w-2xl mx-auto'>
            Explore top-rated courses designed to boost your skills, enhance careers, and unlock opportunities in tech, AI, business, and beyond.
          </p>
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 justify-items-center'>
          {loading ? (
            // Skeleton Loaders
            [1, 2, 3].map((n) => <CourseSkeleton key={n} />)
          ) : popularCourses.length > 0 ? (
            // Actual Content
            popularCourses.map((course, index) => (
              <Card
                key={index}
                thumbnail={course.thumbnail}
                title={course.title}
                category={course.category}
                price={course.price}
                id={course._id}
                reviews={course.reviews}
              />
            ))
          ) : (
            // Beautiful Empty State
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-30">
              <FaGraduationCap className="text-8xl mb-6 text-gray-400" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-gray-300">No Courses Found</h3>
              <p className="text-gray-400 font-medium mt-2 italic">Wait for the future to be written.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardPage;