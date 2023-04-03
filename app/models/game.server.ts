import { Player } from "./player.server";
import { supabase } from "./user.server";

type GamesPlayers = {
  id: string;
  game_id: string;
  player_id: string;
  players?: Player;
  role: "owner" | "player";
};

export type Game = {
  id: string;
  status: string;
  rounds: number;
  games_players?: GamesPlayers[];
};

export async function createGame({
  rounds,
  ownerId,
}: {
  rounds: number;
  ownerId: string;
}): Promise<Game | null> {
  const { data, error } = await supabase
    .from<Game>("games")
    .insert([{ status: "waiting", rounds }])
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function setGameOwner({
  gameId,
  ownerId,
}: {
  gameId: string;
  ownerId: string;
}) {
  const { error } = await supabase.from<GamesPlayers>("games_players").upsert({
    player_id: ownerId,
    role: "owner",
    game_id: gameId,
  });

  if (error) {
    throw error;
  }
}

export async function getGame(id: Game["id"]): Promise<Game | null> {
  const { data, error } = await supabase
    .from<Game>("games")
    .select("*,games_players(*,players(*))")
    .eq("id", id)
    .single();

  if (!error) {
    return data;
  }

  return null;
}
