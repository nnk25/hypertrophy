import { sessions, users, workoutTemplates } from "@/db/schema";
import { db } from "./drizzle";
import { eq } from "drizzle-orm";
import { sessionSchema, userSchema, workoutTemplateSchema } from "./types";

export async function createUser(userData: { id: string; email: string; name: string; image: string }) {
    try {
        const parsedUserData = userSchema.safeParse(userData);
        if(!parsedUserData.success) {
            throw parsedUserData.error
        }
        await db.insert(users).values(parsedUserData.data)
    } catch (error) {
        console.error("Error creating user:", error)
        throw error
    }
}

export async function createWorkoutTemplate(userId: string, title: string, exercises: any) {
    try {
        const parsedWorkoutData = workoutTemplateSchema.safeParse({userId, title, exercises});
        if(!parsedWorkoutData.success) {
            throw parsedWorkoutData.error
        }
        return await db.insert(workoutTemplates).values(parsedWorkoutData.data).returning({workoutId: workoutTemplates.id})
    } catch (error) {
        console.error("Error creating workout template:", error)
        throw error
    }
}

export async function createWorkoutSession({ userId, workoutTemplateId, exerciseData, duration, totalVolume }: { userId: string; workoutTemplateId: string; exerciseData: any; duration: number; totalVolume: number }) {
    try {
        const parsedExerciseData = sessionSchema.safeParse({
            userId,
            workoutTemplateId,
            exerciseData,
            duration: duration,
            totalVolume: totalVolume
        })
        if(!parsedExerciseData.success) {
            throw parsedExerciseData.error
        }
        const workoutSession = await db.insert(sessions).values(parsedExerciseData.data).returning({sessionId: sessions.id})
        return workoutSession
    } catch (error) {
        console.error("Error creating workout session:", error)
        throw error
    }
}

export async function getWorkoutTemplateById(workoutId: string) {
    try {
        const workoutTemplate = await db.select().from(workoutTemplates).where(eq(workoutTemplates.id, workoutId))
        return workoutTemplate
    } catch (error) {
        console.error("Error fetching workout template:", error)
        throw error
    }
}