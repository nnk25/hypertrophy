"use client";

import { Button } from "@/components/ui/button";
import { Dumbbell, Zap, ActivityIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";

export function MobileNavbar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-border">
            <div className="flex items-center justify-between h-16 px-4 gap-4">
                {/* Workouts */}
                <Link
                    href="/workouts"
                    className="flex-1 flex justify-center"
                    aria-label="Workouts"
                >
                    <Dumbbell className="size-6" />
                </Link>

                {/* Generate Workout - Center Action Button */}
                <Link href="/generate" className="flex-1 flex justify-center" aria-label="Generate Workout">
                    <Button
                        variant="default"
                        size="icon-lg"
                        className="rounded-full size-14 flex-shrink-0 shadow-lg"
                        aria-label="Generate Workout"
                    >
                        <Zap className="size-6" />
                    </Button>
                </Link>

                {/* Sessions */}
                <Link
                    href="/sessions"
                    className="flex-1 flex justify-center"
                    aria-label="Sessions"
                >
                    <HistoryIcon className="size-6" />
                </Link>
            </div>
        </nav>
    );
}
