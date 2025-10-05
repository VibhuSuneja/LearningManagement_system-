import Review from "../model/reviewModel.js";
import Course from "../model/courseModel.js";

export const createReview = async (req, res) => {
  try {
    
    const { rating, comment ,courseId} = req.body;
    const userId = req.userId; 
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {return res.status(400).json({ message: "Course not found" });
  }
    // Optional: prevent duplicate review by same user
    const alreadyReviewed = await Review.findOne({ course: courseId, user: userId });
    if (alreadyReviewed) {return res.status(400).json({ message: "You have already reviewed this course" });}

    const review = new Review({
      course: courseId,
      user: userId,
      rating,
      comment
    });

    await review.save();

    course.reviews.push(review._id);
    await course.save();

    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({message:`Failed to create review ${error}`});
  }
}


export const getReviews = async (req, res) => {
  try {
    
    const review = await Review.find({}).populate("user", "name photoUrl role description")
  .populate("course", "title").sort({reviewedAt :  -1 })
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews" });
  }
};


export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name photoUrl role") // Populate user name & photo
      .sort({ reviewedAt: -1 }); // Optional: latest first

    return res.status(200).json(
      reviews
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
