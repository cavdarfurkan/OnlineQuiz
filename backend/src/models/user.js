class User {
  constructor(first_name, last_name, email, password) {
    this._first_name = first_name;
    this._last_name = last_name;
    this._email = email;
    this._password = password;
  }

  static get fields() {
    return [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "first_name VARCHAR(255) NOT NULL",
      "last_name VARCHAR(255) NOT NULL",
      "email VARCHAR(255) NOT NULL UNIQUE",
      "password VARCHAR(255) NOT NULL",
    ];
  }

  static get keys() {
    return ["first_name", "last_name", "email", "password"];
  }
}

module.exports = User;
