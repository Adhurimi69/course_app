exports.getCourses = (req, res) => {
    res.json({ message: "Get all courses" });
};

exports.createCourse = (req, res) => {
    const { title, description } = req.body;
    res.json({ message: `Course created: ${title}` });
};
