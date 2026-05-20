export interface EmulatorRoom {
  _id: string;
  name: string;
  fname?: string;
  msgs: number;
  usernames?: string[];
  t: "p" | "c" | "d";
}

export interface EmulatorMessage {
  _id: string;
  ts: string;
  u: { username: string; name?: string };
  msg: string;
}

export interface EmulatorSeed {
  userId: string;
  authToken: string;
  rooms: EmulatorRoom[];
  messagesByRoomId: Record<string, EmulatorMessage[]>;
}

export declare const defaultSeed: EmulatorSeed;
export declare const plugin: unknown;
export declare const contract: { service: string; endpoints: string };
export default plugin;
