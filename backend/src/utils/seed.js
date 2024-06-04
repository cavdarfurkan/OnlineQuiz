const getPool = require("../utils/db");
const Course = require("../models/course");

const tables = [
  {
    name: "courses",
    fields: [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "name VARCHAR(255) NOT NULL",
      "description TEXT",
      "credits INT NOT NULL",
    ],
    keys: ["name", "description", "credits"],
    data: [
      new Course("Math", "Mathematics", 3),
      new Course("Science", "Science", 3),
      new Course("History", "History", 3),
      new Course("English", "English", 3),
      new Course("Computer Science", "Computer Science", 3),
    ],
  },
  {
    name: "exams",
    fields: [
      "id INT AUTO_INCREMENT PRIMARY KEY",
      "name VARCHAR(255) NOT NULL",
      "subject TEXT",
      "date DATE NOT NULL",
    ],
    keys: ["name", "subject", "date"],
    data: [
      { name: "Midterm", subject: "Math", date: "2021-10-15" },
      { name: "Final", subject: "Math", date: "2021-12-15" },
      { name: "Midterm", subject: "Science", date: "2021-10-15" },
      { name: "Final", subject: "Science", date: "2021-12-15" },
      { name: "Midterm", subject: "History", date: "2021-10-15" },
      { name: "Final", subject: "History", date: "2021-12-15" },
      { name: "Midterm", subject: "English", date: "2021-10-15" },
      { name: "Final", subject: "English", date: "2021-12-15" },
      { name: "Midterm", subject: "Computer Science", date: "2021-10-15" },
      { name: "Final", subject: "Computer Science", date: "2021-12-15" },
    ],
  },
];

async function seedDatabase() {
  try {
    const pool = await getPool();

    for (const table of tables) {
      console.log(`Creating table ${table.name}`);
      await pool.execute(`DROP TABLE IF EXISTS ${table.name}`);
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

    // Insert course data into courses table
    // for (const course of courses) {
    //   await conn.query(
    //     "INSERT INTO courses(name, description, credits) VALUES (?, ?, ?);",
    //     [course.name, course.description, course.credits]
    //   );
    // }
    // // Insert teacher data into teachers table
    // for (const teacher of teachers) {
    //   await conn.query(
    //     "INSERT INTO teachers(name, subject, office_hours) VALUES (?, ?, ?);",
    //     [teacher.name, teacher.subject, teacher.officeHours]
    //   );
    // }
    // // Insert student data into teachers table
    // for (const student of students) {
    //   await conn.query(
    //     "INSERT INTO students(name, subject, grade) VALUES (?, ?, ?);",
    //     [student.name, student.subject, student.grade]
    //   );
    // }
    // // Insert exam data into teachers table
    // for (const exam of exams) {
    //   await conn.query(
    //     "INSERT INTO exams(name, subject, date) VALUES (?, ?, ?);",
    //     [exam.name, exam.subject, exam.date]
    //   );
    // }

    // console.log("Database seeded successfully.");
    // await pool.destroy();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function createTables(pool) {
  //   // Create teachers table
  //   await conn.query(`
  //         CREATE TABLE IF NOT EXISTS teachers (
  //             id INT AUTO_INCREMENT PRIMARY KEY,
  //             name VARCHAR(255) NOT NULL,
  //             subject TEXT,
  //             office_hours INT NOT NULL);
  //     `);

  //   // Create students table
  //   await conn.query(`
  //   CREATE TABLE IF NOT EXISTS students (
  //       id INT AUTO_INCREMENT PRIMARY KEY,
  //       name VARCHAR(255) NOT NULL,
  //       subject TEXT,
  //       grade INT NOT NULL);
  //     `);

  console.log("Database tables created.");
}

seedDatabase();
