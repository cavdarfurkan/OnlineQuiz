class Option {
  constructor(option_text, question_id, is_correct) {
    this.option_text = option_text;
    this.question_id = question_id;
    this.is_correct = is_correct;
  }

  static get fields() {
    return [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "option_text VARCHAR(255) NOT NULL",
      "question_id INT NOT NULL",
      "is_correct BOOLEAN NOT NULL",
      "FOREIGN KEY (question_id) REFERENCES question(id)",
    ];
  }

  static get keys() {
    return ["option_text", "question_id", "is_correct"];
  }
}

module.exports = Option;
