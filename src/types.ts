export interface User {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  score: number;
}

export interface GameState {
  users: User[];
  currentUser: User | null;
  gameMode: 'cpu' | 'player' | null;
  targetPoints: number;
  playerOneChoice: string | null;
  playerTwoChoice: string | null;
  scores: {
    playerOne: number;
    playerTwo: number;
  };
  gameHistory: {
    date: string;
    winner: string;
    score: string;
  }[];
}