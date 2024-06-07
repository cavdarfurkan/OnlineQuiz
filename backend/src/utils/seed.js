const getPool = require("../utils/db");
const bcrypt = require("bcrypt");
const Course = require("../models/course");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const User = require("../models/user");
const Exam = require("../models/exam");
const Question = require("../models/question");
const Option = require("../models/option");
const Role = require("../models/role");

const defaultPassword = bcrypt.hashSync("password", 10);

const tables = [
  {
    name: "roles",
    fields: Role.fields,
    keys: Role.keys,
    data: [new Role("teacher"), new Role("student"), new Role("admin")],
  },
  {
    name: "users",
    fields: User.fields,
    keys: User.keys,
    data: [
      new User("John", "Doe", "johndoe@example.com", defaultPassword),
      new User("Jane", "Doe", "janedoe@example.com", defaultPassword),
      new User("Alice", "Smith", "examplee@example.com", defaultPassword),
      new User("Furkan", "Cavdar", "example@example.com", defaultPassword),
      new User("Admin", "Admin", "admin@admin.com", defaultPassword),
    ],
  },
  {
    name: "user_roles",
    fields: [
      "user_id INT NOT NULL",
      "role_id INT NOT NULL",
      "FOREIGN KEY (user_id) REFERENCES users(id)",
      "FOREIGN KEY (role_id) REFERENCES roles(id)",
    ],
    keys: ["user_id", "role_id"],
    data: [
      [1, 1],
      [2, 2],
      [3, 2],
      [4, 1],
      [4, 2],
      [4, 3],
      [5, 3],
    ],
  },
  {
    name: "courses",
    fields: Course.fields,
    keys: Course.keys,
    data: [
      new Course(
        "CS101",
        "Introduction to Computer Science",
        "An introductory course to computer science",
        "2021-09-15",
        1
      ),
      new Course(
        "CS102",
        "Data Structures",
        "A course about data structures",
        "2021-09-15",
        1
      ),
      new Course(
        "CS103",
        "Algorithms",
        "A course about algorithms",
        "2021-09-15",
        1
      ),
      new Course(
        "TIN",
        "Internet Technologies",
        "A course about internet",
        "2021-09-15",
        4
      ),
    ],
  },
  {
    name: "student_courses",
    fields: [
      "student_id INT NOT NULL",
      "course_id INT NOT NULL",
      "FOREIGN KEY (student_id) REFERENCES users(id)",
      "FOREIGN KEY (course_id) REFERENCES courses(id)",
    ],
    keys: ["student_id", "course_id"],
    data: [
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
  },
  {
    name: "exams",
    fields: Exam.fields,
    keys: Exam.keys,
    data: [
      new Exam("Midterm", "2021-10-15", 90, 50, 1),
      new Exam("Final", "2021-12-15", 120, 50, 1),
      new Exam("Midterm", "2021-10-15", 90, 60, 2),
      new Exam("Final", "2021-12-15", 120, 50, 2),
      new Exam("Midterm", "2021-10-15", 90, 50, 3),
      new Exam("Final", "2021-12-15", 120, 50, 3),
    ],
  },
  {
    name: "student_exams",
    fields: [
      "student_id INT NOT NULL",
      "exam_id INT NOT NULL",
      "grade INT NOT NULL",
      "start_time TIMESTAMP NOT NULL",
      "end_time TIMESTAMP NOT NULL",
      "FOREIGN KEY (student_id) REFERENCES users(id)",
      "FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE",
    ],
    keys: ["student_id", "exam_id", "grade", "start_time", "end_time"],
    data: [
      [2, 1, 70, "2021-10-15 10:00:00", "2021-10-15 11:30:00"],
      [3, 1, 75, "2021-10-15 10:00:00", "2021-10-15 11:30:00"],
    ],
  },
  {
    name: "question",
    fields: Question.fields,
    keys: Question.keys,
    data: [
      new Question("What is the capital of Turkey?", 1),
      new Question("What is the capital of France?", 1),
      new Question("What is the capital of Germany?", 1),
      new Question("What is the capital of Poland?", 1),
      new Question("What is the capital of Spain?", 1),
    ],
  },
  {
    name: "options",
    fields: Option.fields,
    keys: Option.keys,
    data: [
      new Option("Ankara", 1, true),
      new Option("Istanbul", 1, false),
      new Option("Izmir", 1, false),
      new Option("Antalya", 1, false),
      new Option("Paris", 2, true),
      new Option("Lyon", 2, false),
      new Option("Marseille", 2, false),
      new Option("Nice", 2, false),
      new Option("Berlin", 3, true),
      new Option("Hamburg", 3, false),
      new Option("Munich", 3, false),
      new Option("Cologne", 3, false),
      new Option("Warsaw", 4, true),
      new Option("Krakow", 4, false),
      new Option("Wroclaw", 4, false),
      new Option("Poznan", 4, false),
      new Option("Madrid", 5, true),
      new Option("Barcelona", 5, false),
      new Option("Valencia", 5, false),
      new Option("Seville", 5, false),
    ],
  },
  {
    name: "student_answers",
    fields: [
      "student_id INT NOT NULL",
      "question_id INT NOT NULL",
      "answered_option_id INT NOT NULL",
      "FOREIGN KEY (student_id) REFERENCES users(id)",
      "FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE",
      "FOREIGN KEY (answered_option_id) REFERENCES options(id) ON DELETE CASCADE",
    ],
    keys: ["student_id", "question_id", "answered_option_id"],
    data: [
      [2, 1, 1],
      [2, 2, 5],
      [2, 3, 9],
      [2, 4, 13],
      [2, 5, 17],
      [3, 1, 2],
      [3, 2, 6],
      [3, 3, 10],
      [3, 4, 14],
      [3, 5, 18],
    ],
  },
];

async function seedDatabase() {
  try {
    const pool = await getPool();

    for (const table of tables) {
      await pool.execute("SET foreign_key_checks = 0");
      await pool.execute(`DROP TABLE IF EXISTS ${table.name}`);
      await pool.execute("SET foreign_key_checks = 1");

      console.log(`Creating table ${table.name}`);
      await pool.execute(
        `CREATE TABLE IF NOT EXISTS ${table.name} (${table.fields.join(", ")});`
      );

      for (const item of table.data) {
        await pool.execute(
          `INSERT INTO ${table.name}(${table.keys}) VALUES (${Array(
            table.keys.length
          )
            .fill("?")
            .join(", ")})`,
          Object.values(item)
        );
      }
    }

    await pool.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

seedDatabase();
