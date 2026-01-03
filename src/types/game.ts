export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  prize: number;
  congratulation?: string;
  imageUrl?: string;
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

export interface AudioFiles {
  wrongAnswer?: string;
  correctAnswer?: string;
  phoneCall?: string;
  fiftyFifty?: string;
  questionTheme?: string;
  answerSelected?: string;
  menuTheme?: string;
  finalQuestionTheme?: string;
}