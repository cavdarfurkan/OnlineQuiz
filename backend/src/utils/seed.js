const getPool = require("../utils/db");
const bcrypt = require("bcrypt");
const Course = require("../models/course");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const User = require("../models/user");
const Exam = require("../models/exam");
const Question = require("../models/question");
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
      new Exam("Midterm", "2021-10-15", 90, 1),
      new Exam("Final", "2021-12-15", 120, 1),
      new Exam("Midterm", "2021-10-15", 90, 2),
      new Exam("Final", "2021-12-15", 120, 2),
      new Exam("Midterm", "2021-10-15", 90, 3),
      new Exam("Final", "2021-12-15", 120, 3),
    ],
  },
  {
    name: "student_exams",
    fields: [
      "student_id INT NOT NULL",
      "exam_id INT NOT NULL",
      "grade INT",
      "FOREIGN KEY (student_id) REFERENCES users(id)",
      "FOREIGN KEY (exam_id) REFERENCES exams(id)",
    ],
    keys: ["student_id", "exam_id", "grade"],
    data: [
      [2, 1, null],
      [2, 2, 90],
      [3, 1, 85],
      [3, 2, 95],
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
