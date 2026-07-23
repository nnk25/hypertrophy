import { json, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import z from "zod";

export const workoutSchema = z.object({
    title: z.string().min(1, "Title is required").describe("The title of the workout session"),
    exercises: z.array(
        z.object({
            name: z.string().min(1, "Exercise name is required").describe("The name of the exercise"),
            sets: z.number().min(1, "Sets must be at least 1").describe("The number of sets for the exercise"),
            reps: z.number().min(1, "Reps must be at least 1").describe("The number of repetitions for the exercise"),
            rest: z.number().min(0, "Rest time cannot be negative").describe("The rest time in seconds between sets")
        })
    ).min(1, "At least one exercise is required").describe("A list of exercises in the workout session")})

export const preferencesSchema = z.object({
    goal: z.string().min(1, "Goal is required").describe("The fitness goal of the user"),
    experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).describe("The experience level of the user"),
    targetMuscleGroups: z.string().min(1, "Muscle group is required").describe("The target muscle groups for the workout session"),
    sessionDuration: z.number().min(1, "Session duration must be at least 1 minute").describe("The duration of the workout session in minutes"),
    equipment: z.string().optional().describe("The equipment available for the workout session")
})

export const goalEnum = pgEnum("goal", ["fat_loss", "hypertrophy", "enduarance"])
export const experienceLevelEnum = pgEnum("experience_level", ["beginner", "intermediate", "advanced"])

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    email: varchar().notNull().unique(),
    name: varchar().notNull(),
    image: varchar(),
    createdAt: timestamp()
})

export const programs = pgTable("programs", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id),
    title: varchar().notNull(),
    description: varchar().notNull(),
    preferences: json().notNull(), // Store preferences as a JSON string
    createdAt: timestamp().defaultNow()
})

export const workouts = pgTable("workouts", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id),
    programId: uuid().notNull().references(() => programs.id),
    title: varchar().notNull(),
    exercises: json().notNull(), // Store exercises as a JSON string
    createdAt: timestamp().defaultNow()
})

export const sessions = pgTable("sessions", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id),
    workoutId: uuid().notNull().references(() => workouts.id),
    completed: timestamp().defaultNow(),
    createdAt: timestamp().defaultNow()
})