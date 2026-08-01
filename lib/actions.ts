import { sessions, users, workoutTemplates } from "@/db/schema";
import { db } from "./drizzle";
import { count, desc, eq } from "drizzle-orm";
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

export async function getWorkoutTemplatesByUserId(userId: string) {
    try {
        const userWorkoutTemplates = await db.select().from(workoutTemplates).where(eq(workoutTemplates.userId, userId)).orderBy(desc(workoutTemplates.createdAt))
        return userWorkoutTemplates
    } catch (error) {
        console.error("Error fetching workout templates:", error)
        throw error
    }
}

export async function getWorkoutSessionsByUserId(userId: string, limit?: number, offset?: number) {
    try {
        const userWorkoutSessions = await db.query.sessions.findMany({
            limit: limit ?? 5,
            offset: offset,
            where: {
                userId: userId
            },
            orderBy: {createdAt: "desc"},
            with: {
                workoutTemplates: true
            }
        })
        const totalCountResult = await db.select({ count: count() }).from(sessions).where(eq(sessions.userId, userId))
        const totalCount = totalCountResult[0]?.count ?? 0

        return {data: userWorkoutSessions, count: totalCount}
    } catch (error) {
        console.error("Error fetching workout sessions:", error)
        throw error
    }
}

export async function deleteWorkoutTemplateById(workoutId: string) {
    try {
        await db.delete(workoutTemplates).where(eq(workoutTemplates.id, workoutId))
    } catch (error) {
        console.error("Error deleting workout template:", error)
        throw error
    }
}

export async function deleteSessionsByWorkoutTemplateId(workoutTemplateId: string) {
    try {
        await db.delete(sessions).where(eq(sessions.workoutTemplateId, workoutTemplateId))
    } catch (error) {
        console.error("Error deleting sessions for workout template:", error)
        throw error
    }
}