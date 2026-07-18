import { defineStore } from "pinia";
import { ref } from "vue";

export interface IGameData {
  AName: string | undefined;
  BName: string | undefined;
  AId: string | undefined;
  BId: string | undefined;
  ALogo: string | undefined;
  BLogo: string | undefined;
  sets: ISetData[];
  currentSetShow?: number;
  showGame: boolean;
}

export interface ISetData {
  setNumber: number;
  scoreA: number;
  scoreB: number;
  finalized?: boolean;
}

export const useGameStore = defineStore("game", {
  state: () => ({
    gameData: ref<IGameData>({
      AName: undefined,
      BName: undefined,
      AId: undefined,
      BId: undefined,
      ALogo: undefined,
      BLogo: undefined,
      sets: [
        { setNumber: 1, scoreA: 0, scoreB: 0 },
        { setNumber: 2, scoreA: 0, scoreB: 0 },
        { setNumber: 3, scoreA: 0, scoreB: 0 },
        { setNumber: 4, scoreA: 0, scoreB: 0 },
        { setNumber: 5, scoreA: 0, scoreB: 0 },
        { setNumber: 6, scoreA: 0, scoreB: 0 },
        { setNumber: 7, scoreA: 0, scoreB: 0 },
        { setNumber: 8, scoreA: 0, scoreB: 0 },
        { setNumber: 9, scoreA: 0, scoreB: 0 },
      ],
      currentSetShow: 1,
      showGame: true,
    }),
  }),
  getters: {
    pointsWonA: (state) => {
      return state.gameData?.sets[(state.gameData.currentSetShow ?? 1) - 1]?.scoreA ?? 0;
    },
    pointsWonB: (state) => {
      return state.gameData?.sets[(state.gameData.currentSetShow ?? 1) - 1]?.scoreB ?? 0;
    },
    setsWonA: (state) => {
      return state.gameData?.sets.filter((set) => set.scoreA > set.scoreB && hasSetBeenWon(set.scoreA, set.scoreB)).length || 0;
    },
    setsWonB: (state) => {
      console.log("sets won b");
      return state.gameData?.sets.filter((set) => set.scoreA < set.scoreB && hasSetBeenWon(set.scoreA, set.scoreB)).length || 0;
    },
    nameA: (state) => {
      return state.gameData?.AName || "A";
    },
    nameB: (state) => {
      return state.gameData?.BName || "B";
    },
    idA: (state) => {
      return state.gameData?.AId || "A";
    },
    idB: (state) => {
      return state.gameData?.BId || "B";
    },
    fullGameState: (state) => {
      return state.gameData;
    },
    currentSetShow: (state) => {
      return state.gameData?.currentSetShow || 1;
    },
    shouldShowGame: (state) => {
      return state.gameData?.showGame;
    },
  },
  actions: {
    setGameState(gameData: IGameData) {
      this.gameData.AName = gameData.AName;
      this.gameData.BName = gameData.BName;
      this.gameData.AId = gameData.AId;
      this.gameData.BId = gameData.BId;
      this.gameData.ALogo = gameData.ALogo;
      this.gameData.BLogo = gameData.BLogo;
      this.gameData.sets = gameData.sets.map((set) => ({
        setNumber: set.setNumber,
        scoreA: set.scoreA,
        scoreB: set.scoreB,
        finalized: hasSetBeenWon(set.scoreA, set.scoreB),
      }));
      this.gameData.currentSetShow = gameData.currentSetShow;
      this.gameData.showGame = gameData.showGame;
    },
    setNameA(name: string) {
      this.gameData.AName = name;
    },
    setNameB(name: string) {
      this.gameData.BName = name;
    },
    setIdA(id: string) {
      this.gameData.AId = id;
    },
    setIdB(id: string) {
      this.gameData.BId = id;
    },
  },
});

const hasSetBeenWon = (scoreA: number, scoreB: number): boolean => {
  if (scoreA >= 11 || scoreB >= 11) {
    if (Math.abs(scoreA - scoreB) >= 2) {
      return true;
    }
    if (scoreA >= 15 || scoreB >= 15) {
      return true;
    }
  }
  return false;
};
