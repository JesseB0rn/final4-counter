export const EMessageType = {
  GAME_DATA: "gameData",
  SET_DATA: "setData",
  GAME_START: "gameStart",
  GAME_END: "gameEnd",
  SET_START: "setStart",
  SET_END: "setEnd",
  SCORE_UPDATE: "scoreUpdate",
} as const;

export type EMessageType = (typeof EMessageType)[keyof typeof EMessageType];
