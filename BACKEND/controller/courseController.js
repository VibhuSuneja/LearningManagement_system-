import uploadOnCloudinary from "../config/cloudinary.js"
import Course from "../model/courseModel.js"
import Lecture from "../model/lectureModel.js"; 
import User from "../model/UserModel.js"

// create Courses
export const createCourse = async (req,res) => {

    try {
        const {title,category} = req.body
        if(!title || !category){
            return res.status(400).json({message:"title and category is required"})
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })
        
        return res.status(201).json(course)
    } catch (error) {
         return res.status(500).json({message:`Failed to create course ${error}`})
    }
    
}

export const getPublishedCourses = async (req,res) => {
try {
    // Correctly query the database for courses where isPublished is true
    const courses = await Course.find({ isPublished: true }).populate("lectures")
    .populate("creator").populate("reviews");

    if (!courses) {
      return res.status(404).json({
        message: "No courses found",
      });
    }

    res.status(200).json({
      message: "All courses",
      courses,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(`Fetching courses for creator ID: ${userId}`); // DEBUGGING LOG

    const courses = await Course.find({ creator: userId })
      .populate("lectures")
      .populate("creator"); // THE ESSENTIAL FIX

    if (!courses) {
      console.log(`No courses found for creator ID: ${userId}`); // DEBUGGING LOG
      return res.status(404).json({ message: "Course not found" });
    }

    console.log(`Found ${courses.length} courses. First course creator field:`, courses[0]?.creator); // DEBUGGING LOG
    return res.status(200).json(courses);
  } catch (error) {
    console.error(`Error in getCreatorCourses: ${error}`); // DEBUGGING LOG
    return res.status(500).json({ message: `Failed to get creator courses ${error}` });
  }
};

export const editCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const {title , subTitle , description , category , level , price , isPublished } = req.body;
        let thumbnail
         if(req.file){
            thumbnail =await uploadOnCloudinary(req.file.buffer)
                }
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        const updateData = {title , subTitle , description , category , level , price , isPublished ,thumbnail}

        course = await Course.findByIdAndUpdate(courseId , updateData , {new:true})
        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({message:`Failed to update course ${error}`})
    }
}


export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
         return res.status(200).json(course)
        
    } catch (error) {
        return res.status(500).json({message:`Failed to get course ${error}`})
    }
}
export const removeCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();
    return res.status(200).json({ message: "Course Removed Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:`Failed to remove course ${error}`})
  }
};


//for lectures


export const createLecture = async (req,res) => {
    try {
        const {lectureTitle}= req.body
        const {courseId} = req.params

        if(!lectureTitle || !courseId){
             return res.status(400).json({message:"Lecture Title required"})
        }
        const lecture = await Lecture.create({lectureTitle})
        const course = await Course.findById(courseId)
        if(course){
            course.lectures.push(lecture._id)
            await course.save() // Save the course document after modification
        }
        
        const populatedCourse = await Course.findById(courseId).populate("lectures") // Re-fetch the course with populated lectures to return the latest data
        
        return res.status(201).json({lecture,course: populatedCourse})
        
    } catch (error) {
        return res.status(500).json({message:`Failed to Create Lecture ${error}`})
    }
    
}

export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId).populate("lectures") // Populate lectures directly in the query
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message:`Failed to get Lectures ${error}`})
    }
}

export const editLecture = async (req,res) => {
    try {
        const {lectureId} = req.params
        const {isPreviewFree , lectureTitle} = req.body
        const lecture = await Lecture.findById(lectureId)
          if(!lecture){
            return res.status(404).json({message:"Lecture not found"})
        }
        let videoUrl
        if(req.file){
            videoUrl =await uploadOnCloudinary(req.file.buffer)
            lecture.videoUrl = videoUrl
                }
        if(lectureTitle){
            lecture.lectureTitle = lectureTitle
        }
        lecture.isPreviewFree = isPreviewFree
        
         await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({message:`Failed to edit Lectures ${error}`})
    }
    
}

export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if(!lecture){
             return res.status(404).json({message:"Lecture not found"})
        }
        //remove the lecture from associated course

        await Course.updateOne(
            {lectures: lectureId},
            {$pull:{lectures: lectureId}}
        )
        return res.status(200).json({message:"Lecture Remove Successfully"})
        }
    
     catch (error) {
        return res.status(500).json({message:`Failed to remove Lectures ${error}`})
    }
}

//get Creator data


// controllers/userController.js

export const getCreatorById = async (req, res) => {
  try {
    const {userId} = req.body;

    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json( user );
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "get Creator error" });
  }
};
