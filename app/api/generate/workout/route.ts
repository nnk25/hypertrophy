import { preferencesSchema, workoutSchema } from "@/db/schema"
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
            Target Muscle Groups: ${validation.data.targetMuscleGroups}
            ${validation.data.equipment ? `Equipment: ${validation.data.equipment}` : ""}
            Session duration : ${validation.data.sessionDuration} minutes
    
            Requirements:
                - Include warmup
                - Include a workout title
                - Include a list of exercises targeting the specified muscle groups
                - Include sets and reps
                - Include rest time between sets
            `
        })
    
        return Response.json({output})
    } catch (error) {
        return Response.json({error: "An error occurred while generating the workout session."}, {status: 500})
    }
}