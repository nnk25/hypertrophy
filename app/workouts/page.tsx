import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { NotebookPenIcon } from "lucide-react"
import Link from "next/link"

const WorkoutPages = () => {
  return (
    <Empty>
        <EmptyHeader>
            <EmptyTitle>No workouts saved</EmptyTitle>
            <EmptyDescription>Generate a workout to get started</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
            <Link href="/generate"><Button variant={"outline"}>Generate workout</Button></Link>
        </EmptyContent>
    </Empty>
  )
}

export default WorkoutPages