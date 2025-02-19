import { create } from 'zustand';
import { GameState } from './types';

const useStore = create<GameState>((set) => ({
  users: [],
  currentUser: null,
  gameMode: null,
  targetPoints: 10,
  playerOneChoice: null,
  playerTwoChoice: null,
  scores: {
    playerOne: 0,
    playerTwo: 0,
  },
  gameHistory: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setGameMode: (mode) => set({ gameMode: mode }),
  setTargetPoints: (points) => set({ targetPoints: points }),
  setPlayerChoice: (player, choice) =>
    set(player === 'one' ? { playerOneChoice: choice } : { playerTwoChoice: choice }),
  updateScores: (winner) =>
    set((state) => ({
      scores: {
        ...state.scores,
        [winner === 'one' ? 'playerOne' : 'playerTwo']: state.scores[winner === 'one' ? 'playerOne' : 'playerTwo'] + 1,
      },
    })),
  addToHistory: (entry) =>
    set((state) => ({
      gameHistory: [...state.gameHistory, entry],
    })),
  resetGame: () =>
    set({
      playerOneChoice: null,
      playerTwoChoice: null,
      scores: {
        playerOne: 0,
        playerTwo: 0,
      },
    }),
}));

export default useStore;