'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { toast } from "@/components/ui/toast"
import { Spinner } from "@/components/ui/spinner"
import { Trash2 } from "lucide-react"

type WorkoutTemplate = {
  id: string
  title: string
  exercises: Array<{ name: string }>
  createdAt: string | Date
}

export default function WorkoutPages() {
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/workout")
        if (!response.ok) {
          throw new Error("Failed to fetch workout templates")
        }
        const data = await response.json()
        setWorkouts(Array.isArray(data) ? data : [])
      } catch (error) {
        toast.add({
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while loading workouts.",
          type: "error" 
        })
        setWorkouts([])
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  const handleDelete = async (templateId: string) => {
    try {
      setDeletingId(templateId)
      const response = await fetch(`/api/workout/${templateId}`, { method: "DELETE" })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "Failed to delete workout")
      }

      setWorkouts(prev => prev.filter(workout => workout.id !== templateId))
      toast.add({
        title: "Workout deleted",
        description: "The workout template has been removed.",
        type: "success"
      })
    } catch (error) {
      toast.add({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "An error occurred while deleting the workout.",
        type: "error"
      })
    } finally {
      setDeletingId(null)
    }
  }

  const isEmpty = !loading && workouts.length === 0

  if (isEmpty) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No workouts saved</EmptyTitle>
          <EmptyDescription>Generate a workout to get started</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/generate">
            <Button variant="outline">Generate workout</Button>
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }


  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workouts</h1>
          <p className="text-sm text-muted-foreground">Your generated workout templates</p>
        </div>
        <Link href="/generate">
          <Button variant="outline">Generate workout</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workouts.map(workout => {
          const exerciseNames = workout.exercises.map(exercise => exercise.name)
          const visibleExercises = exerciseNames.slice(0, 3)
          const remainingCount = exerciseNames.length - visibleExercises.length

          return (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/workouts/${workout.id}`} className="hover:underline">
                    {workout.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  Created {new Date(workout.createdAt).toLocaleDateString()}
                </CardDescription>
                <CardAction>
                        <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(workout.id)}
                  disabled={deletingId === workout.id}
                >
                  {deletingId === workout.id ? <Spinner/> : <Trash2/>}
                </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Exercises</p>
                <div className="flex flex-wrap gap-2">
                  {visibleExercises.map(name => (
                    <span
                      key={name}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {name}
                    </span>
                  ))}
                  {remainingCount > 0 && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      +{remainingCount} more
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
              
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}