import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyDescription, EmptyContent, EmptyTitle } from "@/components/ui/empty"
import Link from "next/link"

const SessionsPage = () => {
  return (
     <Empty>
        <EmptyHeader>
            <EmptyTitle>You haven't worked out yet</EmptyTitle>
            <EmptyDescription>Generate a workout to get started</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
            <Link href="/generate"><Button variant={"outline"}>Generate workout</Button></Link>
        </EmptyContent>
    </Empty>
  )
}

export default SessionsPage