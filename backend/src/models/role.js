class Role {
  constructor(role_name) {
    this._role_name = role_name;
  }

  static get fields() {
    return [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "role_name VARCHAR(255) NOT NULL UNIQUE",
    ];
  }

  static get keys() {
    return ["role_name"];
  }
}

module.exports = Role;
