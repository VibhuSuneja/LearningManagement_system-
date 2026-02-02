import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card'; // <-- ADD THIS LINE
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
    <div className='relative flex items-center justify-center flex-col min-h-[400px]'>
      <h1 className='md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]'>
        Our Popular Courses
      </h1>
      <span className='lg:w-[50%] md:w-[80%] text-[15px] text-center mt-[30px] mb-[30px] px-[20px]'>
        Explore top-rated courses designed to boost your skills, enhance careers, and unlock opportunities in tech, AI, business, and beyond.
      </span>
      
      <div className='w-[100%] flex items-center justify-center flex-wrap gap-[50px] lg:p-[50px] md:p-[30px] p-[10px] mb-[40px]'>
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
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <FaGraduationCap className="text-8xl text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-gray-300 uppercase tracking-widest">No Courses Found</h3>
            <p className="text-gray-400 font-medium">Be the first to create an amazing learning path!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardPage;