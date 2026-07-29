"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { workoutQuestions } from "@/data/generate-workout-questions"
import { Progress } from "@/components/ui/progress"
import { preferencesSchema, Question, workoutSchema } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function GenerateWorkoutPage() {
  const questions = workoutQuestions as Question[]
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[] | null>>(() => {
    const initial: Record<string, string | string[] | null> = {}
    questions.forEach((q) => {
      const key = (q as any).value ?? q.question
      initial[key] = null
    })
    return initial
  })
  const [finished, setFinished] = useState(false)
  const [generating, setGenerating] = useState(false)
  const current = questions[index]
  const router = useRouter()

  async function generateWorkout() {
    setError(null)
    const parsedAnwers = preferencesSchema.safeParse(answers)
    if (!parsedAnwers.success) {
      console.error("Validation failed", parsedAnwers.error)
      setError("Validation failed. Please check your answers.")
      return
    }
    try {
      setGenerating(true)
      const response = await fetch("/api/workout/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedAnwers.data),
      })
      const data = await response.json()
      setGenerating(false)

      if (!response.ok) {
        console.error("Failed to generate workout")
        setError("Failed to generate workout. Please try again.")
        return
      }

      router.push(`/workouts/${data.workoutId}`)

    } catch (err) {
      console.error("Error generating workout", err)
      setError("An error occurred while generating the workout. Please try again.")
      setGenerating(false)
    }
  }

  function toggleOption(opt: string) {
    const key = (current as any).value ?? current.question

    if (current.type === "single-choice") {
      setAnswers((prev) => ({ ...prev, [key]: opt }))
      return
    }

    // multi-choice
    setAnswers((prev) => {
      const prevVals = (prev[key] as string[] | null) ?? []
      const s = new Set(prevVals)
      if (s.has(opt)) s.delete(opt)
      else s.add(opt)
      return { ...prev, [key]: Array.from(s) }
    })
  }

  const goNext = () => {
    if (finished) return
    if (index < questions.length - 1) {
      setIndex(index + 1)
      return
    }
    setFinished(true)
  }

  const goPrev = () => {
    if (finished) {
      setFinished(false)
    }
    if (index > 0) setIndex(index - 1)
  }

  const isAnswered = () => {
    console.log("answers", answers)
    if (finished) return true
    const key = (current as any).value ?? current.question
    const a = answers[key]
    if (current.type === "single-choice") return typeof a === "string" && a.length > 0
    return Array.isArray(a) && a.length > 0
  }

  return (
    <main className="min-h-screen flex flex-col p-4">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4 -mx-4 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goPrev} disabled={index === 0 && !finished}>
              <ChevronLeft />
            </Button>
            <div className="text-sm text-muted-foreground select-none">
              {finished ? "Summary" : `Question ${index + 1} of ${questions.length}`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goNext} disabled={!isAnswered() || finished}>
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="w-full max-w-2xl mx-auto my-4">
          <Progress value={100 * (index + 1) / questions.length} />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="md:bg-popover p-6 rounded-lg shadow-sm">
              {!finished ? (
                <section className="h-full">
                  <h2 className="text-lg font-semibold mb-2">{current.question}</h2>

                  <div className={`mt-4 grid ${current.style === "grid" ? "grid-cols-2" : ""} gap-3`}>
                    {current.options.map((opt) => {
                      const key = (current as any).value ?? current.question
                      const selected =
                        current.type === "single-choice"
                          ? answers[key] === opt.label
                          : Array.isArray(answers[key]) && (answers[key] as string[]).includes(opt.label)

                      return (
                        <Button
                          key={opt.value}
                          variant={selected ? "default" : "outline"}
                          onClick={() => toggleOption(opt.label)}
                          className="justify-start h-[50px] py-4"
                          size="lg"
                        >
                          <div className="flex flex-col text-sm gap-1 justify-start">
                            <span className="truncate">{opt.label}</span>
                            {opt.description && <span className="text-xs text-muted-foreground text-left">{opt.description}</span>}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </section>
              ) : (
                <section>
                  <h2 className="text-lg font-semibold mb-4">Summary</h2>
                  <div className="space-y-3">
                    {questions.map((q, i) => {
                      const key = (q as any).value ?? q.question
                      return (
                        <div key={i} className="p-3 border rounded-md">
                          <div className="text-sm font-medium">{q.question}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {q.type === "single-choice"
                              ? (answers[key] as string) ?? "—"
                              : (answers[key] as string[] | null)?.join(", ") ?? "—"}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* <div className="mt-6 flex justify-end">
                    <Button onClick={() => console.log("Generate with", answers)}>Generate Workout</Button>
                  </div> */}
                </section>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end w-full max-w-2xl mx-auto">
          {error && <div className="text-sm text-center mt-4 text-destructive mr-4">{error}</div>}
          <Button onClick={finished ? generateWorkout : goNext} disabled={!isAnswered()} className="mt-6 w-full h-[50px]" size="lg">
            {generating ? "Generating..." : index === questions.length - 1 ? "Generate Workout " : "Continue"}
          </Button>
        </div>

      </div>



    </main>
  )
}