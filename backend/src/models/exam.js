class Exam {
  constructor(title, date, duration, course_id) {
    this.title = title;
    this.date = date;
    this.duration = duration;
    this.course_id = course_id;
    // this._questions = [];
  }

  addQuestion(question) {
    this._questions.push(question);
  }

  static get fields() {
    return [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "title VARCHAR(255) NOT NULL",
      "date DATE NOT NULL",
      "duration INT NOT NULL",
      "course_id INT NOT NULL",
      "FOREIGN KEY (course_id) REFERENCES courses(id)",
    ];
  }

  static get keys() {
    return ["title", "date", "duration", "course_id"];
  }
}

module.exports = Exam;
