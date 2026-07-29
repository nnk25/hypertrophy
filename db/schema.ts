import { defineRelations } from "drizzle-orm";
import { decimal, integer, jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const goalEnum = pgEnum("goal", ["fat_loss", "hypertrophy", "enduarance"])
export const experienceLevelEnum = pgEnum("experience_level", ["beginner", "intermediate", "advanced"])

export const users = pgTable("users", {
    id: varchar({ length: 255 }).primaryKey(),
    email: varchar().notNull().unique(),
    name: varchar().notNull(),
    image: varchar(),
    createdAt: timestamp().defaultNow()
})

export const programs = pgTable("programs", {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().references(() => users.id),
    title: varchar().notNull(),
    description: varchar(),
    preferences: jsonb().notNull(), // Store preferences as a JSON string
    createdAt: timestamp().defaultNow()
})

export const workoutTemplates = pgTable("workout_templates", {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().references(() => users.id),
    programId: uuid().references(() => programs.id),
    title: varchar().notNull(),
    exercises: jsonb().notNull(), // Store exercises as a JSON string
    createdAt: timestamp().defaultNow()
})

export const sessions = pgTable("sessions", {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().references(() => users.id),
    workoutTemplateId: uuid().notNull().references(() => workoutTemplates.id),
    exerciseData: jsonb().notNull(), // Store exercise data as a JSON string
    duration: integer().notNull(),
    totalVolume: decimal({mode:"number", precision: 10, scale: 2}).notNull(),
    createdAt: timestamp().defaultNow()
})

export const relations = defineRelations({users, workoutTemplates, programs}, (r) => ({
    users: {
        workoutTemplates: r.many.workoutTemplates({
            from: r.users.id,
            to: r.workoutTemplates.userId
        }),
        programs: r.many.programs({
            from: r.users.id,
            to: r.programs.userId
        })
    },
    programs: {
        workoutTemplates: r.many.workoutTemplates({
            from: r.programs.id,
            to: r.workoutTemplates.programId
        })
    }
}))