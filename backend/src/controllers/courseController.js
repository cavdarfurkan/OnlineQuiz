const getCourseById = async (req, res) => {
  //   return await courseRepository.getCourseById(id);
  return res.json({ message: "getCourseById" });
};

const getAllCourses = async (req, res) => {
  //   return await courseRepository.getAllCourses();
  return res.json({ message: "getAllCourses" });
};

module.exports = { getCourseById, getAllCourses };
