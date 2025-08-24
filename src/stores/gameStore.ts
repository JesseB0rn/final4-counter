import { defineStore } from "pinia";
import { ref } from "vue";

export interface IGameData {
  AName: string | undefined;
  BName: string | undefined;
  sets: ISetData[];
  currentSetShow?: number;
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
    fullGameState: (state) => {
      return state.gameData;
    },
    currentSetShow: (state) => {
      return state.gameData?.currentSetShow || 1;
    },
  },
  actions: {
    setGameState(gameData: IGameData) {
      this.gameData.AName = gameData.AName;
      this.gameData.BName = gameData.BName;
      this.gameData.sets = gameData.sets.map((set) => ({
        setNumber: set.setNumber,
        scoreA: set.scoreA,
        scoreB: set.scoreB,
        finalized: hasSetBeenWon(set.scoreA, set.scoreB),
      }));
      this.gameData.currentSetShow = gameData.currentSetShow;
    },
    setNameA(name: string) {
      this.gameData.AName = name;
    },
    setNameB(name: string) {
      this.gameData.BName = name;
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
