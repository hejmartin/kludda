import { supabase } from "./user.server";

export type Player = {
  id: string;
  name: string;
  game_id: string;
};

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from<Player>("players")
    .select("id, name")
    .eq("id", id)
    .single();

  if (data == null) {
    return null;
  }

  if (error) {
    throw error;
  }

  return data;
}

export async function createPlayer({
  name,
}: {
  name?: string;
} = {}): Promise<Player> {
  const { data, error } = await supabase
    .from<Player>("players")
    .insert([{ name }])
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function setPlayerName({
  playerId,
  name,
}: {
  playerId: string;
  name: string;
}) {
  const { error } = await supabase
    .from<Player>("players")
    .update({ name })
    .eq("id", playerId);

  if (error) {
    throw error;
  }
}
