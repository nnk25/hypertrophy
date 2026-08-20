'use client'

import { Exercise } from "@/components/Exercise"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { Check } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import z from "zod"

interface ExerciseData {
  name: string
  sets: number
  reps: number
  rest: number
}

interface WorkoutTemplate {
  id: string
  title: string
  exercises: ExerciseData[]
}

interface SessionExerciseData {
  name: string
  data: {
    setNumber: number
    weight: number
    reps: number
    completed: boolean
  }[]
}

export default function WorkoutPage() {
  const params = useParams()
  const workoutId = params.id as string
  const [workoutTemplate, setWorkoutTemplate] = useState<WorkoutTemplate | null>(null)
  const [isInSession, setIsInSession] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [sessionData, setSessionData] = useState<SessionExerciseData[]>([])
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef<number | null>(null)

  const totalVolume = useMemo(() => {
    return sessionData.reduce((sum, exercise) => {
      return sum + exercise.data.reduce((exerciseSum, set) => {
        return set.completed ? exerciseSum + (Number(set.weight) || 0) * (Number(set.reps) || 0) : exerciseSum
      }, 0)
    }, 0)
  }, [sessionData])

  useEffect(() => {
    const fetchWorkoutTemplate = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/workout/${workoutId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch workout template")
        }
        const data = await response.json()
        const template = Array.isArray(data) ? data[0] : data
        setWorkoutTemplate(template)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (workoutId) {
      fetchWorkoutTemplate()
    }
  }, [workoutId])

  // Start/stop timer when session toggles
  useEffect(() => {
    if (isInSession) {
      setStartTime(Date.now())
      setElapsedSeconds(0)
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isInSession])

  // Initialize session data when starting a session
  const initializeSessionData = () => {
    if (!workoutTemplate) return
    const initial = workoutTemplate.exercises.map(ex => ({
      name: ex.name,
      data: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        weight: 0,
        reps: ex.reps,
        completed: false,
      })),
    }))
    setSessionData(initial)
  }

  const handleToggleSession = () => {
    const next = !isInSession
    setIsInSession(next)
    if (next) {
      initializeSessionData()
      setStartTime(Date.now())
    } else {
      // stopping session -- keep data
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Called by Exercise components to push their set data
  const handleExerciseChange = (payload: { name: string; data: { setNumber: number; weight: string; reps: string; completed: boolean }[] }) => {
    setSessionData(prev => {
      const existingIndex = prev.findIndex(p => p.name === payload.name)
      const converted = {
        name: payload.name,
        data: payload.data.map(d => ({
          setNumber: d.setNumber,
          weight: Number(d.weight) || 0,
          reps: Number(d.reps) || 0,
          completed: Boolean(d.completed),
        })),
      }
      if (existingIndex === -1) {
        return [...prev, converted]
      }
      const copy = [...prev]
      copy[existingIndex] = converted
      return copy
    })
  }

  const sessionExerciseSchema = z.array(z.object({
    name: z.string().min(1),
    data: z.array(z.object({
      setNumber: z.number().min(1),
      weight: z.number().min(0),
      reps: z.number().min(1),
      completed: z.boolean(),
    }))
  }))

  const formatTime = (secs: number) => {
    const mm = Math.floor(secs / 60)
    const ss = secs % 60
    return `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
  }

  const handleCompleteWorkout = async () => {
    if (!workoutTemplate) return

    //if no sets are completed return
    const anyCompleted = sessionData.some(ex => ex.data.some(set => set.completed))
    if (!anyCompleted) {
      toast.add({ title: "No Sets Completed", description: "Please complete at least one set before finishing the workout.", type: "error" })
      return
    }

    // Ensure we have data for all exercises; if missing, build defaults
    const exerciseSessionData: SessionExerciseData[] = workoutTemplate.exercises.map(ex => {
      const found = sessionData.find(s => s.name === ex.name)
      if (found) return found
      return {
        name: ex.name,
        data: Array.from({ length: ex.sets }, (_, i) => ({ setNumber: i + 1, weight: 0, reps: ex.reps, completed: false }))
      }
    })

    const parsed = sessionExerciseSchema.safeParse(exerciseSessionData)
    if (!parsed.success) {
      toast.add({ title: "Validation Error", description: "Please check your session data.", type: "error" })
      return
    }

    const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : elapsedSeconds
    // const totalVolume = exerciseSessionData.reduce((sum, ex) => {
    //   return sum + ex.data.reduce((s, set) => s + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0)
    // }, 0)

    try {
      setSubmitting(true)
      const response = await fetch(`/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutTemplateId: workoutId, exerciseData: exerciseSessionData, duration, totalVolume })
      })

      if (!response.ok) {
        const text = await response.text()
        toast.add({ title: 'Error', description: text || 'Failed to complete workout', type: 'error' })
        return
      }

      setIsInSession(false)
      setStartTime(null)
      setElapsedSeconds(0)
      setSessionData([])
      toast.add({ title: 'Workout Completed', description: 'Your workout session has been saved successfully.', type: 'success' })
    } catch (err) {
      toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'An error occurred while saving the workout session.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p><Spinner/> </p>
      </div>
    )
  }

  if (error || !workoutTemplate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">{error || "Workout not found"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold">{workoutTemplate.title}</h1>
          <p className="text-sm text-muted-foreground mt-2">{workoutTemplate.exercises.length} exercises • {formatTime(elapsedSeconds)} • Volume: {totalVolume} lbs</p>
        </div>
        <Button onClick={handleToggleSession} variant={isInSession ? "secondary" : "default"} size="lg">
          {isInSession ? "Stop Workout" : "Start Workout"}
        </Button>
      </div>

      {/* Body - Exercises List */}
      <div className="space-y-6">
        {workoutTemplate.exercises.map((exercise, index) => (
          <Exercise
            key={index}
            name={exercise.name}
            sets={exercise.sets}
            reps={exercise.reps}
            rest={exercise.rest}
            isInSession={isInSession}
            onChange={(payload) => handleExerciseChange(payload)}
          />
        ))}
      </div>

      {/* Footer - Complete Workout Button */}
      {isInSession && (
        //a circular button at the bottom right corner of the screen
        <div className="fixed bottom-20 right-3 md:bottom-8 md:right-8 lg:right-12">
          <Button onClick={handleCompleteWorkout} className="bg-primary/90 rounded-full p-6 flex justify-center items-center size-16" size="icon-lg" disabled={submitting}>
            {submitting ? <Spinner/> : <Check className="h-6 w-6 font-bold"/>}
          </Button>
        </div>
      )}
    </div>
  )
}