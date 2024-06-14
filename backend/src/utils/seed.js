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
      new User("Alice", "Smith", "example@example.com", defaultPassword),
      new User("Furkan", "Cavdar", "me@me.com", defaultPassword),
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
      [3, 1],
      [4, 2],
      [5, 3],
    ],
  },
  {
    name: "courses",
    fields: Course.fields,
    keys: Course.keys,
    data: [
      new Course(
        "GEO101",
        "Geography",
        "A course about geography",
        "2024-12-12",
        1
      ),
      new Course(
        "MATH101",
        "Mathematics",
        "A course about mathematics",
        "2023-12-12",
        1
      ),
      new Course(
        "CS101",
        "Algorithms",
        "A course about algorithms",
        "2024-09-15",
        3
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
      [4, 1],
      [4, 2],
    ],
  },
  {
    name: "exams",
    fields: Exam.fields,
    keys: Exam.keys,
    data: [
      new Exam("Midterm", "2024-10-15", 90, 50, 1),
      new Exam("Final", "2024-12-15", 120, 50, 1),
      new Exam("Midterm", "2024-10-15", 90, 60, 2),
      new Exam("Final", "2024-12-15", 120, 50, 2),
      new Exam("Midterm", "2023-10-15", 90, 50, 3),
      new Exam("Final", "2023-12-15", 120, 50, 3),
    ],
  },
  {
    name: "student_exams",
    fields: [
      "student_id INT NOT NULL",
      "exam_id INT NOT NULL",
      "grade INT NOT NULL",
      "start_time DATETIME NOT NULL",
      "end_time DATETIME NOT NULL",
      "FOREIGN KEY (student_id) REFERENCES users(id)",
      "FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE",
    ],
    keys: ["student_id", "exam_id", "grade", "start_time", "end_time"],
    data: [
      [2, 1, 80, "2024-10-15 10:00:00", "2024-10-15 11:30:00"],
      [2, 2, 90, "2024-12-15 10:00:00", "2024-12-15 12:00:00"],
      [2, 3, 70, "2023-10-15 10:00:00", "2023-10-15 11:30:00"],
      [2, 4, 85, "2023-12-15 10:00:00", "2023-12-15 12:00:00"],
      [4, 1, 85, "2024-10-15 10:00:00", "2024-10-15 11:30:00"],
      [4, 2, 95, "2024-12-15 10:00:00", "2024-12-15 12:00:00"],
      [4, 3, 75, "2023-10-15 10:00:00", "2023-10-15 11:30:00"],
      [4, 4, 90, "2023-12-15 10:00:00", "2023-12-15 12:00:00"],
    ],
  },
  {
    name: "question",
    fields: Question.fields,
    keys: Question.keys,
    data: [
      new Question("What is the capital of Poland?", 1),
      new Question("What is the capital of Germany?", 1),
      new Question("What is the capital of Turkey?", 1),
      new Question("What is the capital of France?", 1),
      new Question("What is the capital of Spain?", 1),

      new Question("What is 2 + 2?", 2),
      new Question("What is 5 * 5?", 2),
      new Question("What is 10 / 2?", 2),
      new Question("What is 3 - 1?", 2),
      new Question("What is 10 + 10?", 2),

      new Question("What is an algorithm?", 3),
      new Question("What is a data structure?", 3),
      new Question("What is a linked list?", 3),
      
      new Question("2x + 5 = 11", 4),
      new Question("What is the value of sin(30)", 4),
    ],
  },
  {
    name: "options",
    fields: Option.fields,
    keys: Option.keys,
    data: [
      new Option("Krakow", 1, false),
      new Option("Warsaw", 1, true),
      new Option("Wroclaw", 1, false),
      new Option("Poznan", 1, false),
      new Option("Berlin", 2, true),
      new Option("Hamburg", 2, false),
      new Option("Munich", 2, false),
      new Option("Cologne", 2, false),
      new Option("Istanbul", 3, false),
      new Option("Izmir", 3, false),
      new Option("Ankara", 3, true),
      new Option("Antalya", 3, false),
      new Option("Lyon", 4, false),
      new Option("Marseille", 4, false),
      new Option("Paris", 4, true),
      new Option("Nice", 4, false),
      new Option("Madrid", 5, true),
      new Option("Barcelona", 5, false),
      new Option("Valencia", 5, false),
      new Option("Seville", 5, false),

      new Option("2", 6, false),
      new Option("3", 6, false),
      new Option("4", 6, true),
      new Option("5", 6, false),
      new Option("20", 7, false),
      new Option("25", 7, true),
      new Option("30", 7, false),
      new Option("35", 7, false),
      new Option("5", 8, true),
      new Option("10", 8, false),
      new Option("15", 8, false),
      new Option("20", 8, false),
      new Option("1", 9, false),
      new Option("2", 9, true),
      new Option("3", 9, false),
      new Option("4", 9, false),
      new Option("50", 10, false),
      new Option("40", 10, false),
      new Option("30", 10, false),
      new Option("20", 10, true),

      new Option("A set of rules to be followed in calculations", 11, true),
      new Option("A set of rules to be followed in a game", 11, false),
      new Option("A set of rules to be followed in a conversation", 11, false),
      new Option("A set of rules to be followed in a book", 11, false),
      new Option("A way of storing data in a computer", 12, false),
      new Option("A way of storing data in a database", 12, false),
      new Option("A way of storing data in a file", 12, false),
      new Option("A way of storing data in a program", 12, true),
      new Option(
        "A data structure that contains a sequence of elements",
        13,
        false
      ),
      new Option(
        "A data structure that contains a sequence of nodes",
        13,
        true
      ),
      new Option(
        "A data structure that contains a sequence of arrays",
        13,
        false
      ),
      new Option(
        "A data structure that contains a sequence of objects",
        13,
        false
      ),
    
      new Option("x = 2", 14, false),
      new Option("x = 3", 14, true),
      new Option("x = 4", 14, false),
      new Option("x = 5", 14, false),
      new Option("0.5", 15, true),
      new Option("0.25", 15, false),
      new Option("0.75", 15, false),
      new Option("1.0", 15, true),
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
      [2, 1, 2],
      [2, 2, 5],
      [2, 3, 11],
      [2, 4, 16],
      [2, 5, 20],
      [2, 6, 4],
      [2, 7, 7],
      [2, 8, 10],
      [2, 9, 14],
      [2, 10, 19],
      [2, 11, 12],
      [2, 12, 16],
      [2, 13, 20],

      [4, 1, 2],
      [4, 2, 5],
      [4, 3, 11],
      [4, 4, 16],
      [4, 5, 20],
      [4, 6, 4],
      [4, 7, 7],
      [4, 8, 10],
      [4, 9, 14],
      [4, 10, 19],
      [4, 11, 12],
      [4, 12, 16],
      [4, 13, 20],
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
