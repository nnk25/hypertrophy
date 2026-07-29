import { getWorkoutTemplateById } from "@/lib/actions"

export async function GET(request: Request, { params }: { params: Promise<{ workoutTemplateId: string }> }) {
    try {
        const workoutTemplate = await getWorkoutTemplateById((await params).workoutTemplateId)
        if (!workoutTemplate) {
            return Response.json({ error: "Workout template not found" }, { status: 404 })
        }
        return Response.json(workoutTemplate)
    } catch (error) {
        console.error("Error fetching workout template:", error)
        return Response.json({ error: "An error occurred while fetching the workout template." }, { status: 500 })
    }
}