'use client'

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Dumbbell, Layers3, Timer, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"

type SessionSet = {
    setNumber: number
    weight: number
    reps: number
    completed: boolean
}

type SessionExercise = {
    name: string
    data: SessionSet[]
}

type WorkoutTemplate = {
    id: string
    title: string
}

type WorkoutSession = {
    id: string
    duration: number
    totalVolume: number
    createdAt: string
    exerciseData: SessionExercise[]
    workoutTemplates?: WorkoutTemplate | null
}

type SessionsResponse = {
    data: WorkoutSession[]
    count: number
}

const PAGE_SIZE = 6

function formatDuration(seconds: number) {
    const totalSeconds = Math.max(0, Number(seconds) || 0)
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
}

function formatCreatedAt(value: string) {
    const date = new Date(value)
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date)
}

function SessionCard({ session }: { session: WorkoutSession }) {
    const workoutTitle = session.workoutTemplates?.title ?? "Workout session"
    const completedExercises = session.exerciseData.filter(exercise =>
        exercise.data.some(set => set.completed)
    )

    const completedSetCount = completedExercises.reduce((count, exercise) => {
        return count + exercise.data.filter(set => set.completed).length
    }, 0)

    return (
        <Card>
            <Collapsible defaultOpen={false}>
                <CardHeader className="border-b">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5">
                            <CardTitle className="text-lg">{workoutTitle}</CardTitle>
                            <CardDescription>{formatCreatedAt(session.createdAt)}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-full px-3 py-1">
                                {session.exerciseData.length} exercises
                            </Badge>
                            <CollapsibleTrigger className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-2.5 text-sm font-medium text-foreground shadow-xs transition-all hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                                View
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="space-y-5 pt-5">
                        <div className="grid gap-3 sm:grid-cols-3">
                            <Card size="sm">
                                <CardContent className="space-y-1.5 p-3">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        Total volume
                                    </div>
                                    <div className="text-lg font-semibold">{Number(session.totalVolume).toLocaleString()} lbs</div>
                                </CardContent>
                            </Card>

                            <Card size="sm">
                                <CardContent className="space-y-1.5 p-3">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Timer className="h-3.5 w-3.5" />
                                        Duration
                                    </div>
                                    <div className="text-lg font-semibold">{formatDuration(session.duration)}</div>
                                </CardContent>
                            </Card>

                            <Card size="sm">
                                <CardContent className="space-y-1.5 p-3">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Dumbbell className="h-3.5 w-3.5" />
                                        Completed sets
                                    </div>
                                    <div className="text-lg font-semibold">{completedSetCount}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Layers3 className="h-4 w-4 text-muted-foreground" />
                                Completed exercise summary
                            </div>

                            {completedExercises.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No completed sets were recorded for this session.</p>
                            ) : (
                                <div className="space-y-3">
                                    {completedExercises.map(exercise => {
                                        const finishedSets = exercise.data.filter(set => set.completed)

                                        return (
                                            <div key={exercise.name} className="rounded-xl border bg-background p-3">
                                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                                    <h4 className="font-medium">{exercise.name}</h4>
                                                    <Badge variant="secondary">{finishedSets.length} completed sets</Badge>
                                                </div>

                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Set</TableHead>
                                                            <TableHead>Weight</TableHead>
                                                            <TableHead>Reps</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {finishedSets.map(set => (
                                                            <TableRow key={`${exercise.name}-${set.setNumber}`}>
                                                                <TableCell className="font-medium">{set.setNumber}</TableCell>
                                                                <TableCell>{Number(set.weight).toLocaleString()} lbs</TableCell>
                                                                <TableCell>{set.reps}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}

export default function SessionsPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [sessions, setSessions] = useState<WorkoutSession[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [reloadToken, setReloadToken] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const page = useMemo(() => {
        const parsed = Number.parseInt(searchParams.get("page") ?? "1", 10)
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
    }, [searchParams])

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    }, [totalCount])

    useEffect(() => {
        const controller = new AbortController()

        const fetchSessions = async () => {
            try {
                setLoading(true)
                setError(null)

                const offset = (page - 1) * PAGE_SIZE
                const response = await fetch(`/api/sessions?limit=${PAGE_SIZE}&offset=${offset}`, {
                    signal: controller.signal,
                    cache: "no-store",
                })

                if (!response.ok) {
                    const payload = await response.json().catch(() => null)
                    throw new Error(payload?.message || "Failed to fetch workout sessions")
                }

                const data = (await response.json()) as SessionsResponse
                const nextSessions = Array.isArray(data.data) ? data.data : []
                const nextTotal = typeof data.count === "number" ? data.count : 0

                setSessions(nextSessions)
                setTotalCount(nextTotal)

                const maxPage = Math.max(1, Math.ceil(nextTotal / PAGE_SIZE))
                if (page > maxPage) {
                    const params = new URLSearchParams(searchParams.toString())
                    params.set("page", String(maxPage))
                    router.replace(`${pathname}?${params.toString()}`)
                }
            } catch (err) {
                if ((err as Error).name === "AbortError") {
                    return
                }

                setError(err instanceof Error ? err.message : "An error occurred while loading sessions.")
                setSessions([])
                setTotalCount(0)
            } finally {
                setLoading(false)
            }
        }

        fetchSessions()

        return () => controller.abort()
    }, [page, reloadToken, router, pathname, searchParams])

    const fromItem = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
    const toItem = Math.min(page * PAGE_SIZE, totalCount)

    const updatePage = (nextPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(nextPage))
        router.replace(`${pathname}?${params.toString()}`)
    }

    if (error) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>Sessions unavailable</EmptyTitle>
                    <EmptyDescription>{error}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button variant="outline" onClick={() => setReloadToken(prev => prev + 1)}>
                        Try again
                    </Button>
                </EmptyContent>
            </Empty>
        )
    }

    if (loading && sessions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <Spinner />
            </div>
        )
    }

    // if (!loading && sessions.length === 0) {
    //     return (
    //         <Empty>
    //             <EmptyHeader>
    //                 <EmptyTitle>No workout sessions yet</EmptyTitle>
    //                 <EmptyDescription>Complete a workout to start building your session history.</EmptyDescription>
    //             </EmptyHeader>
    //             <EmptyContent>
    //                 <Link href="/generate">
    //                     <Button variant="outline">Generate workout</Button>
    //                 </Link>
    //             </EmptyContent>
    //         </Empty>
    //     )
    // }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight">Sessions</h1>
                        <Badge variant="secondary" className="rounded-full px-3 py-1">
                            {totalCount} total
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Showing {fromItem}-{toItem} of {totalCount} sessions
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updatePage(Math.max(1, page - 1))}
                        disabled={page <= 1 || loading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updatePage(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages || loading}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {sessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>

            <div className="flex items-center justify-between gap-4 border-t pt-4 text-sm text-muted-foreground">
                <p>
                    Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updatePage(Math.max(1, page - 1))}
                        disabled={page <= 1 || loading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updatePage(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages || loading}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}