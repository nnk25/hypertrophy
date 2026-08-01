import { auth } from "@/auth";
import { createWorkoutSession, getWorkoutSessionsByUserId } from "@/lib/actions";
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

export async function GET(request: Request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : undefined;
        const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset") as string) : undefined;
        
        const userId = (await auth())?.user?.id
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }
        const sessions = await getWorkoutSessionsByUserId(userId, limit, offset);
        return Response.json(sessions, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Something went wrong" }, { status: 500 });
    }
}