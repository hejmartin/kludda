import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createGame, setGameOwner } from "~/models/game.server";
import { setPlayerName } from "~/models/player.server";
import {
  commitSession,
  getPlayer,
  getSession,
  PLAYER_SESSION_KEY,
} from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);
  const player = await getPlayer(request);

  session.set(PLAYER_SESSION_KEY, player.id);

  return json(
    {
      name: player.name,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  const player = await getPlayer(request);
  const formData = await request.formData();
  const rounds = formData.get("rounds");
  const name = formData.get("name");

  const game = await createGame({ rounds: Number(rounds), ownerId: player.id });

  if (game == null) {
    throw new Error("Failed to create game");
  }

  await setGameOwner({
    gameId: game.id,
    ownerId: player.id,
  });

  await setPlayerName({
    playerId: player.id,
    name: name as string,
  });

  return redirect(`/game/${game.id}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function CreateGame() {
  const { name } = useLoaderData<typeof loader>();

  return (
    <main className="bg-white">
      <h1>Create Game</h1>
      <form method="post" className="mx-auto flex max-w-md flex-col gap-16">
        <h2>Player details</h2>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" defaultValue={name} />
        <h2>Game details</h2>
        <label htmlFor="rounds">Rounds</label>
        <select name="rounds" id="rounds" defaultValue="2">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
