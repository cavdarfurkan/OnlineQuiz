class Course {
  constructor(
    short_name,
    name,
    description,
    start_date,
    teacher,
    is_archived = false
  ) {
    this._short_name = short_name;
    this._name = name;
    this._description = description;
    this._start_date = start_date;
    this._teacher = teacher;
    this._generateInvitationCode();
    this._is_archived = is_archived;
  }

  _generateInvitationCode() {
    this._invitation_code = Math.random().toString(36).substring(2, 8);
  }

  static get fields() {
    return [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "short_name VARCHAR(255) NOT NULL",
      "name VARCHAR(255) NOT NULL",
      "description TEXT",
      "start_date DATE",
      "teacher_id INT NOT NULL",
      "invitation_code VARCHAR(255) NOT NULL",
      "is_archived BOOLEAN DEFAULT FALSE",
      "FOREIGN KEY (teacher_id) REFERENCES users(id)",
    ];
  }

  static get keys() {
    return [
      "short_name",
      "name",
      "description",
      "start_date",
      "teacher_id",
      "invitation_code",
      "is_archived",
    ];
  }

  //   toJSON() {
  //     return {
  //       name: this._name,
  //       description: this._description,
  //       credits: this._credits,
  //     };
  //   }
}

module.exports = Course;
