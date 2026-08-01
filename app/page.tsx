import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth()
  return (
    <>
    {session?.user ? (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Welcome, {session.user.name}!</h1>
        <p className="text-lg mb-8">You are logged in with email: {session.user.email}</p>
        <p className="text-lg mb-8">You are logged in with ID: {session.user.id}</p>
        <form action={async() => {
          "use server"
          await signOut()
        }
        }>
        <button
          type="submit"
          className="px-4 py-2 bg-none text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
        </form>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <form action={async() => {
          "use server"
          await signIn("google")
        }} className="flex flex-col gap-3 justify-center items-center">
          <p className="text-center my-2">You're not logged in yet</p>
          <Button
            type="submit" variant={"secondary"}>
            Sign In
          </Button>
        </form>
      </div>
    )}
    </>
  );
}
