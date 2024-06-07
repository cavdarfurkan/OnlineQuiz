class Question {
  constructor(question_text, exam_id) {
    this.question_text = question_text;
    this.exam_id = exam_id;
  }

  static get fields() {
    return [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "question_text VARCHAR(255) NOT NULL",
      "exam_id INT NOT NULL",
      "FOREIGN KEY (exam_id) REFERENCES exams(id)",
    ];
  }

  static get keys() {
    return ["question_text", "exam_id"];
  }
}

module.exports = Question;
