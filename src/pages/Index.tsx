import { useState } from 'react';
import GameScreen from '@/components/GameScreen';
import SettingsScreen from '@/components/SettingsScreen';
import { Question } from '@/types/game';

const defaultQuestions: Question[] = [
  {
    id: 1,
    question: 'Какой цвет получается при смешивании синего и желтого?',
    answers: ['Зеленый', 'Оранжевый', 'Фиолетовый', 'Красный'],
    correctAnswer: 0,
    prize: 100
  },
  {
    id: 2,
    question: 'Сколько планет в Солнечной системе?',
    answers: ['7', '8', '9', '10'],
    correctAnswer: 1,
    prize: 200
  },
  {
    id: 3,
    question: 'Какая самая высокая гора в мире?',
    answers: ['Эльбрус', 'Килиманджаро', 'Эверест', 'Монблан'],
    correctAnswer: 2,
    prize: 300
  },
  {
    id: 4,
    question: 'В каком году началась Вторая мировая война?',
    answers: ['1939', '1941', '1914', '1945'],
    correctAnswer: 0,
    prize: 500
  },
  {
    id: 5,
    question: 'Кто написал роман "Война и мир"?',
    answers: ['Достоевский', 'Пушкин', 'Толстой', 'Чехов'],
    correctAnswer: 2,
    prize: 1000
  },
  {
    id: 6,
    question: 'Какой газ необходим для дыхания человека?',
    answers: ['Азот', 'Кислород', 'Углекислый газ', 'Водород'],
    correctAnswer: 1,
    prize: 2000
  },
  {
    id: 7,
    question: 'Столица Австралии?',
    answers: ['Сидней', 'Мельбурн', 'Канберра', 'Брисбен'],
    correctAnswer: 2,
    prize: 4000
  },
  {
    id: 8,
    question: 'Сколько костей в теле взрослого человека?',
    answers: ['206', '186', '226', '196'],
    correctAnswer: 0,
    prize: 8000
  },
  {
    id: 9,
    question: 'В каком году человек впервые высадился на Луну?',
    answers: ['1965', '1967', '1969', '1971'],
    correctAnswer: 2,
    prize: 16000
  },
  {
    id: 10,
    question: 'Какой химический элемент обозначается символом Au?',
    answers: ['Серебро', 'Алюминий', 'Золото', 'Медь'],
    correctAnswer: 2,
    prize: 32000
  },
  {
    id: 11,
    question: 'Кто изобрел телефон?',
    answers: ['Эдисон', 'Белл', 'Тесла', 'Маркони'],
    correctAnswer: 1,
    prize: 64000
  },
  {
    id: 12,
    question: 'Какая самая длинная река в мире?',
    answers: ['Амазонка', 'Нил', 'Янцзы', 'Миссисипи'],
    correctAnswer: 0,
    prize: 125000
  },
  {
    id: 13,
    question: 'Сколько струн у классической гитары?',
    answers: ['4', '5', '6', '7'],
    correctAnswer: 2,
    prize: 250000
  },
  {
    id: 14,
    question: 'Какая планета известна как "Красная планета"?',
    answers: ['Венера', 'Марс', 'Юпитер', 'Сатурн'],
    correctAnswer: 1,
    prize: 500000
  },
  {
    id: 15,
    question: 'В каком году распался Советский Союз?',
    answers: ['1989', '1990', '1991', '1992'],
    correctAnswer: 2,
    prize: 1000000
  }
];

export default function Index() {
  const [screen, setScreen] = useState<'game' | 'settings'>('game');
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [godMode, setGodMode] = useState(false);
  const [gameTitle, setGameTitle] = useState('Кто хочет стать миллионером?');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {screen === 'game' ? (
        <GameScreen 
          questions={questions}
          godMode={godMode}
          gameTitle={gameTitle}
          onOpenSettings={() => setScreen('settings')}
        />
      ) : (
        <SettingsScreen
          questions={questions}
          godMode={godMode}
          gameTitle={gameTitle}
          onQuestionsChange={setQuestions}
          onGodModeChange={setGodMode}
          onGameTitleChange={setGameTitle}
          onBack={() => setScreen('game')}
        />
      )}
    </div>
  );
}