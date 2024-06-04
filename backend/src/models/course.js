class Course {
  constructor(name, description, credits) {
    this._name = name;
    this._description = description;
    this._credits = credits;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get credits() {
    return this._credits;
  }

  toJSON() {
    return {
      name: this._name,
      description: this._description,
      credits: this._credits,
    };
  }

  static getKeys() {
    return ["name", "description", "credits"];
  }
}

module.exports = Course;
