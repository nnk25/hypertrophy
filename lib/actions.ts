import { users, workoutTemplates } from "@/db/schema";
import { db } from "./drizzle";

export async function createUser(userData: { id: string; email: string; name: string; image: string }) {
    try {
        await db.insert(users).values(userData)
    } catch (error) {
        console.error("Error creating user:", error)
        throw error
    }
}

export async function createWorkoutTemplate(userId: string, title: string, exercises: any) {
    try {
        await db.insert(workoutTemplates).values({
            userId,
            title,
            exercises
        })
    } catch (error) {
        console.error("Error creating workout template:", error)
        throw error
    }
}