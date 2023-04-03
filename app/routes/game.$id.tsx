import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGame } from "~/models/game.server";

export async function loader({ params }: LoaderArgs) {
  const game = await getGame(params.id!);

  if (game == null) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({
    game,
  });
}

export default function Game() {
  const { game } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Game #{game.id}</h1>
      <p>Rounds: {game.rounds}</p>
      <h2>Players</h2>
      <ul>
        {game.games_players?.map((participant) => (
          <li key={participant.id}>
            {participant.players?.name}
            {participant.role === "owner" && " (👑)"}
          </li>
        ))}
      </ul>
    </main>
  );
}
