import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// HRMS layer — lightweight, Turso/SQLite compatible, zero VRAM
export const students = sqliteTable("students", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const questions = sqliteTable("questions", {
  id: text("id").primaryKey(), // matches content/bank/*.md id
  grade: text("grade").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(),
  promptTex: text("prompt_tex").notNull(),
  figureSvg: text("figure_svg"),
  materialId: text("material_id"), // GeoGebra id
  answerTex: text("answer_tex"),
  source: text("source"),
});

export const exams = sqliteTable("exams", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  grade: text("grade").notNull(),
  topic: text("topic"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const examQuestions = sqliteTable("exam_questions", {
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id),
  order: integer("order").notNull(),
  points: real("points").notNull().default(1),
});

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id),
  answersJson: text("answers_json").notNull(), // JSON string
  score: real("score"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// — Payments & attendance — business-critical, zero GPU
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id),
  amount: real("amount").notNull(),
  month: text("month").notNull(), // YYYY-MM
  status: text("status").notNull().default("pending"), // pending | paid | overdue
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const attendance = sqliteTable("attendance", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id),
  date: text("date").notNull(), // YYYY-MM-DD
  present: integer("present", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Auth — teacher + student (lightweight, JWT)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"), // teacher | student
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
