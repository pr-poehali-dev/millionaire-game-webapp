export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  prize: number;
  congratulation?: string;
}

export interface GameState {
  currentQuestion: number;
  totalWinnings: number;
  gameOver: boolean;
  won: boolean;
}

export interface Lifeline {
  fiftyFifty: boolean;
  phoneCall: boolean;
  audienceHelp: boolean;
}