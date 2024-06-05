const User = require("./user");

class Teacher extends User {
  constructor(first_name, last_name, email, password, role) {
    super(first_name, last_name, email, password, role);

    // this._courses = [];
  }

  addCourse(course) {
    this._courses.push(course);
  }
}

module.exports = Teacher;
