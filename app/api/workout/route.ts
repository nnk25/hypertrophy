import { auth } from "@/auth"
import { getWorkoutTemplatesByUserId } from "@/lib/actions"

export async function GET() {
    try {
        const userId = (await auth())?.user?.id
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
        }
        const userWorkoutTemplates = await getWorkoutTemplatesByUserId(userId)
        return new Response(JSON.stringify(userWorkoutTemplates), { status: 200 })
    } catch (error) {
        console.error("Error fetching workout:", error)
        return new Response(JSON.stringify({ error: "Failed to fetch workout templates" }), { status: 500 })
    }
}