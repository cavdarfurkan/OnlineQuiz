class Exam {
  constructor(title, date, duration_min, pass_percent, course_id) {
    this.title = title;
    this.date = date;
    this.duration_min = duration_min;
    this.pass_percent = pass_percent;
    this.course_id = course_id;
  }

  static get fields() {
    return [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "title VARCHAR(255) NOT NULL",
      "date DATE NOT NULL",
      "duration_min INT NOT NULL",
      "pass_percent INT NOT NULL DEFAULT 50",
      "course_id INT NOT NULL",
      "FOREIGN KEY (course_id) REFERENCES courses(id)",
    ];
  }

  static get keys() {
    return ["title", "date", "duration_min", "pass_percent", "course_id"];
  }
}

module.exports = Exam;
