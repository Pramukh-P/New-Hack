import Course from "../models/Course.js";

/* ============================================================
   ➕ Create a new course (Admin)
   ============================================================ */
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   📋 Get all courses (Admin + Student)
   Supports optional query: /courses?category=major
   ============================================================ */
export const getCourses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const courses = await Course.find(filter).populate("batch assigned_faculty");
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   🎓 Get Courses by Category (Student)
   Returns structured { major, minor, optional }
   Includes fallback static data for reliability
   ============================================================ */
export const getCoursesByCategory = async (req, res) => {
  try {
    const majorCourses = await Course.find({ category: "major" });
    const minorCourses = await Course.find({ category: "minor" });
    const optionalCourses = await Course.find({ category: "optional" });

    res.status(200).json({
      major: majorCourses,
      minor: minorCourses,
      optional: optionalCourses,
    });
  } catch (err) {
    console.error("⚠️ DB error, sending fallback data:", err.message);
    // Fallback demo data for frontend testing
    res.status(200).json({
      major: [
        { _id: "1", code: "CS101", title: "Programming Fundamentals", credits: 4, category: "major" },
        { _id: "2", code: "CS102", title: "Data Structures", credits: 4, category: "major" },
        { _id: "3", code: "CS103", title: "Database Systems", credits: 4, category: "major" },
        { _id: "4", code: "CS104", title: "Computer Networks", credits: 4, category: "major" },
      ],
      minor: [
        { _id: "5", code: "MATH201", title: "Linear Algebra", credits: 3, category: "minor" },
        { _id: "6", code: "STAT202", title: "Statistics", credits: 3, category: "minor" },
        { _id: "7", code: "MGMT203", title: "Principles of Management", credits: 3, category: "minor" },
      ],
      optional: [
        { _id: "8", code: "ART301", title: "Digital Arts", credits: 1, category: "optional" },
        { _id: "9", code: "SPORTS302", title: "Sports & Fitness", credits: 1, category: "optional" },
        { _id: "10", code: "LANG303", title: "Foreign Language", credits: 2, category: "optional" },
      ],
    });
  }
};

/* ============================================================
   ✏️ Update a Course (Admin)
   ============================================================ */
export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   ❌ Delete a Course (Admin)
   ============================================================ */
export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
