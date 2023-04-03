import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <Link
        to="/game/create"
        className="rounded-md bg-yellow-400 px-16 py-8 font-bold text-black"
      >
        Create Game
      </Link>
    </main>
  );
}
