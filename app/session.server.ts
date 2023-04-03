import type { Session } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { Player } from "./models/player.server";
import { createPlayer, getPlayerById } from "./models/player.server";

invariant(
  process.env.SESSION_SECRET,
  "SESSION_SECRET must be set in your environment variables."
);

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const PLAYER_SESSION_KEY = "playerId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getPlayerId(request: Request) {
  const session = await getSession(request);
  const playerId = session.get(PLAYER_SESSION_KEY);
  return playerId;
}

export async function getPlayer(request: Request): Promise<Player> {
  const playerId = await getPlayerId(request);
  let player = await getPlayerById(playerId);

  if (player == null) {
    player = await createPlayer();
  }

  return player;
}

export async function commitSession(session: Session) {
  return await sessionStorage.commitSession(session, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
