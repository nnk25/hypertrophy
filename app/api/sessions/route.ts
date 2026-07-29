import { auth } from "@/auth";
import { createWorkoutSession } from "@/lib/actions";
import { treeifyError, ZodError } from "zod";

export async function POST(request: Request) {
    try {
        const userId = (await auth())?.user?.id
        const { workoutTemplateId, exerciseData, duration, totalVolume } = await request.json();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }
        const workoutSession = await createWorkoutSession({userId, workoutTemplateId, exerciseData, duration, totalVolume});
        return new Response(JSON.stringify(workoutSession), { status: 201 });
    } catch (error) {
        if(error instanceof ZodError) {
            return new Response(JSON.stringify({ message: "Invalid session data", errors: treeifyError(error) }), { status: 400 });
        }
        return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}