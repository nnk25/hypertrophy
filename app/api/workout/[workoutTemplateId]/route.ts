import { auth } from "@/auth"
import { deleteSessionsByWorkoutTemplateId, deleteWorkoutTemplateById, getWorkoutTemplateById } from "@/lib/actions"

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

export async function DELETE(request: Request, { params }: { params: Promise<{ workoutTemplateId: string }> }) {
    try {
        const workoutTemplateId = (await params).workoutTemplateId
        const workoutToBeDeleted = (await getWorkoutTemplateById(workoutTemplateId))[0]
        if (!workoutToBeDeleted) {
            return Response.json({ error: "Workout template not found" }, { status: 404 })
        }
        const userId = (await auth())?.user?.id
        if (!userId || workoutToBeDeleted.userId !== userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }
        await deleteSessionsByWorkoutTemplateId(workoutTemplateId)
        await deleteWorkoutTemplateById(workoutTemplateId)
        return Response.json({ message: "Workout template deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error deleting workout template:", error)
        return Response.json({ error: "An error occurred while deleting the workout template." }, { status: 500 })
    }
}