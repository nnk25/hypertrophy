"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Dumbbell, HistoryIcon, LogOut, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";

const navigation = [
	{ href: "/workouts", label: "Workouts", icon: Dumbbell },
	{ href: "/sessions", label: "Sessions", icon: HistoryIcon },
	{ href: "/profile", label: "Profile", icon: User },
];

export function DesktopSidebar() {
	const pathname = usePathname();

	const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

	return (
		<aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background md:flex">
			<div className="flex h-full w-full flex-col px-5 py-6">
				<div className="flex items-center justify-center rounded-2xl py-6">
					<Image
						src="/favicon.png"
						alt="Hypertrophy"
						width={64}
						height={64}
						className="size-16 object-contain"
						priority
					/>
				</div>

				<nav className="mt-8 flex flex-1 flex-col gap-2">
					{navigation.map(({ href, label, icon: Icon }) => (
						<Link
							key={href}
							href={href}
							aria-current={isActive(href) ? "page" : undefined}
							className={cn(
								"flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
								isActive(href)
									? "bg-primary/10 text-primary"
									: "text-foreground hover:bg-muted"
								)
							}
						>
							<Icon className={cn("size-5", isActive(href) ? "text-primary" : "text-muted-foreground")} />
							<span>{label}</span>
						</Link>
					))}

					<Link
						href="/generate"
						aria-current={isActive("/generate") ? "page" : undefined}
						className={cn(
							"mt-2 flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
							isActive("/generate")
								? "bg-primary text-primary-foreground"
								: "bg-primary text-primary-foreground hover:bg-primary/90"
						)
						}
					>
						<Zap className="size-5" />
						<span>Generate Workout</span>
					</Link>
				</nav>

				<AlertDialog>
					<AlertDialogTrigger
						render={
							<Button
								variant="ghost"
								className={cn(
									"mt-2 flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
									"text-foreground hover:bg-muted"
								)
							}
						/>
					}
					>
						<LogOut />
						<span>Logout</span>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirm logout?</AlertDialogTitle>
							<AlertDialogDescription>
								You will need to sign in again to access your account.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => signOut({redirectTo: "/"})} variant="destructive">
								Logout
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

		</aside>
	);
}
