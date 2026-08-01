import { auth, signIn, signOut } from "@/auth";

export default async function ProfilePage() {
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
        <h1 className="text-4xl font-bold mb-4">Welcome to the App!</h1>
        <p className="text-lg mb-8">Please sign in to continue.</p>
        <form action={async() => {
          "use server"
          await signIn("google")
        }}>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>
    )}
    </>
  );
}
