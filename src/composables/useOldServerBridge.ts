import { io, type Socket } from "socket.io-client";
import { useGameStore, type IGameData, type ISetData } from "../stores/gameStore";

interface LegacyGameState {
  homeTeam: {
    name: string;
    logo: string;
    sets: number;
    points: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    sets: number;
    points: number;
  };
  currentSet: number;
  setHistory: Array<{
    set: number;
    homePoints: number;
    awayPoints: number;
  }>;
  gameStarted: boolean;
  gameEnded: boolean;
}

const defaultServerUrl = import.meta.env.VITE_OLD_SERVER_URL || "http://localhost:3001";

const legacyServerOrigin = (() => {
  try {
    return new URL(defaultServerUrl).origin;
  } catch {
    return defaultServerUrl;
  }
})();

let socket: Socket | null = null;
let bridgeStarted = false;

const buildSets = (state: LegacyGameState): ISetData[] => {
  const sets = Array.from({ length: 9 }, (_, index) => ({
    setNumber: index + 1,
    scoreA: 0,
    scoreB: 0,
    finalized: false,
  }));

  state.setHistory.forEach((setResult) => {
    if (setResult.set >= 1 && setResult.set <= sets.length) {
      sets[setResult.set - 1] = {
        setNumber: setResult.set,
        scoreA: setResult.homePoints,
        scoreB: setResult.awayPoints,
        finalized: true,
      };
    }
  });

  const activeSetIndex = Math.max(1, Math.min(state.currentSet, sets.length)) - 1;
  sets[activeSetIndex] = {
    setNumber: activeSetIndex + 1,
    scoreA: state.homeTeam.points,
    scoreB: state.awayTeam.points,
    finalized: false,
  };

  return sets;
};

const toLegacyAssetUrl = (assetPath: string): string => {
  if (/^(https?:\/\/|data:)/.test(assetPath)) {
    return assetPath;
  }

  if (assetPath.startsWith("/")) {
    return `${legacyServerOrigin}${assetPath}`;
  }

  return `${legacyServerOrigin}/${assetPath}`;
};

const mapLegacyGameState = (state: LegacyGameState): IGameData => {
  const homeLogo = toLegacyAssetUrl(state.homeTeam.logo);
  const awayLogo = toLegacyAssetUrl(state.awayTeam.logo);

  return {
    AName: state.homeTeam.name,
    BName: state.awayTeam.name,
    AId: homeLogo,
    BId: awayLogo,
    ALogo: homeLogo,
    BLogo: awayLogo,
    sets: buildSets(state),
    currentSetShow: Math.max(1, Math.min(state.currentSet, 9)),
    showGame: state.gameStarted || state.gameEnded,
  };
};

export const useOldServerBridge = () => {
  if (bridgeStarted) {
    return socket;
  }

  bridgeStarted = true;
  const gameStore = useGameStore();

  socket = io(defaultServerUrl, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Connected to legacy scoreboard server:", defaultServerUrl);
  });

  socket.on("gameState", (state: LegacyGameState) => {
    gameStore.setGameState(mapLegacyGameState(state));
  });

  socket.on("gameConfigured", () => {
    console.log("Legacy scoreboard configured");
  });

  socket.on("gameEnded", (payload) => {
    console.log("Legacy scoreboard ended:", payload);
  });

  socket.on("disconnect", () => {
    console.warn("Disconnected from legacy scoreboard server");
  });

  return socket;
};
