import { auth } from "@/auth"
import { preferencesSchema, workoutSchema } from "@/lib/types"
import { createWorkoutTemplate } from "@/lib/actions"
import { groq } from "@ai-sdk/groq"
import { generateText, Output } from "ai"
import { treeifyError } from "zod"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validation = preferencesSchema.safeParse(body)
        if(!validation.success) {
        return Response.json({error: treeifyError(validation.error)}, {status: 400})
        }
    
        const {output} = await generateText({
            model: groq("openai/gpt-oss-120b"),
            output: Output.object({
                schema: workoutSchema
            }),
            prompt: `
            You are a fitness expert. Generate a workout session based on the following input:
            Goal: ${validation.data.goal}
            Experience Level: ${validation.data.experienceLevel}
            Target Muscle Groups: ${validation.data.targetMuscleGroups.join(", ")}
            ${validation.data.equipment ? `Gym Type: ${validation.data.equipment}` : ""}
            Session duration : ${validation.data.sessionDuration}
    
            Requirements:
                - Include warmup
                - Include a workout title
                - Include a list of exercises targeting the specified muscle groups
                - Include sets and reps
                - Include rest time between sets
            `
        })

        if(output) {
            const userId = (await auth())?.user?.id

            if(!userId) {
                return Response.json({error: "User not authenticated"}, {status: 401})
            }
            const [{ workoutId }] = await createWorkoutTemplate(userId, output.title, output.exercises)
            return Response.json({output, workoutId})
        }
        return Response.json({error: "No output generated"}, {status: 500})
    } catch (error) {
        console.error("Error generating workout session:", error)
        return Response.json({error: "An error occurred while generating the workout session."}, {status: 500})
    }
}
