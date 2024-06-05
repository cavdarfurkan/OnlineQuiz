class Question {
  constructor(question, options, answer, exam_id) {
    this.question = question;
    this.options = options;
    this.answer = answer;
    this.exam_id = exam_id;
  }
}

module.exports = Question;
