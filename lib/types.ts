import z from "zod"

export type Option = {
  label: string
  value: string
  description?: string
  image?: string
}

export type Question = {
  question: string
  type: "single-choice" | "multi-choice"
  style?: string
  value?: string
  options: Option[]
}

export const workoutSchema = z.object({
    title: z.string().min(1, "Title is required").describe("The title of the workout session"),
    exercises: z.array(
        z.object({
            name: z.string().min(1, "Exercise name is required").describe("The name of the exercise"),
            sets: z.number().min(1, "Sets must be at least 1").describe("The number of sets for the exercise"),
            reps: z.number().min(1, "Reps must be at least 1").describe("The number of repetitions for the exercise"),
            rest: z.number().min(0, "Rest time cannot be negative").describe("The rest time in seconds between sets")
        })
    ).min(1, "At least one exercise is required").describe("A list of exercises in the workout session")})

export const preferencesSchema = z.object({
    goal: z.enum(["Hypertrophy", "Fat Loss", "Endurance"]).describe("The fitness goal of the user"),
    experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).describe("The experience level of the user"),
    targetMuscleGroups: z.array(z.enum(["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Core"])).nonempty().describe("The target muscle groups for the workout session"),
    sessionDuration: z.enum(["30 minutes", "1 hour", "1.5 hours"]).describe("The duration of the workout session in minutes"),
    equipment: z.enum(["None (Bodyweight only)", "Garage gym", "Local gym", "Fitness center"]).describe("The equipment available for the workout session")
})
