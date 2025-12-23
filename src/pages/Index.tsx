import { useState, useRef, useEffect } from 'react';
import GameScreen from '@/components/GameScreen';
import SettingsScreen from '@/components/SettingsScreen';
import StartMenu from '@/components/StartMenu';
import { Question, AudioFiles } from '@/types/game';

const defaultQuestions: Question[] = [
  {
    id: 1,
    question: 'Сколько у Козы желудочков?',
    answers: ['4', '3', '15', '68'],
    correctAnswer: 0,
    prize: 100
  },
  {
    id: 2,
    question: 'Какую балладу посвятил Дон своей возлюбленной в начале отношений?',
    answers: ['О любви к сельдерею', 'О войне Донов и баронов', 'Про Голоко', 'О созвездии лисят и ящериц'],
    correctAnswer: 3,
    prize: 200
  },
  {
    id: 3,
    question: 'В какой день мы начали встречаться?',
    answers: ['7 декабря 2017', '17 декабря 2017', '3-4 октября 1993 в Москве', '28 октября 1962 на Кубе'],
    correctAnswer: 0,
    prize: 300
  },
  {
    id: 4,
    question: 'Что было началом нашего общения?',
    answers: ['Днюха в макдоналдсе', 'Внезапный лайк вконтакте летом 2017', 'Коттедж с одногруппниками в ноябре 2017', 'Начало войны протоссов и зергов на Шакурасе'],
    correctAnswer: 1,
    prize: 500
  },
  {
    id: 5,
    question: 'Сколько у нас было животных?',
    answers: ['2', '4', '8', '16'],
    correctAnswer: 2,
    prize: 1000
  },
  {
    id: 6,
    question: 'Где был наш первый поцелуй?)',
    answers: ['В таверне', 'У общежития', 'В трамвае', 'На коттедже'],
    correctAnswer: 2,
    prize: 2000
  },
  {
    id: 7,
    question: 'Какое главное предназначение у Доньих копыт?',
    answers: ['Стрелять лазерами, летать', 'Бить морды Баронам', 'Гладить малыша и оплачивать его подарки', 'Создавать материю'],
    correctAnswer: 2,
    prize: 4000
  },
  {
    id: 8,
    question: 'Про кого говорят: «большой лоб, маленькое лицо и есть розовые подушки»',
    answers: ['Джаред Кушнер', 'Зловонные кабаны', 'Мистер Зубочисткинс', 'Майкл Скотт'],
    correctAnswer: 2,
    prize: 8000
  },
  {
    id: 9,
    question: 'Каких сущностей не было в энциклопедии Донов?',
    answers: ['Фраза «Идет Козел, умная голова»', 'Козлиное пианино', 'Песня «волшееебный Козел летит»', 'Умение Дона трансформироваться в ракету Сармат'],
    correctAnswer: 3,
    prize: 16000
  },
  {
    id: 10,
    question: 'Вершина Цыпьей кулинарии по мнению Сената Донов?',
    answers: ['Воскресная яичница', 'Борщ', 'Паста со свининой', 'Донзанья'],
    correctAnswer: 3,
    prize: 32000
  },
  {
    id: 11,
    question: 'Каким спортом никогда не занимался Дон?',
    answers: ['Джиу-джитсу', 'Тайский бокс (муай-тай)', 'Рукопашный бой', 'Дзюдо'],
    correctAnswer: 3,
    prize: 64000
  },
  {
    id: 12,
    question: 'Любимая футбольная команда Дона?',
    answers: ['Манчестер Юнайтед', 'Барселона', 'Реал Мадрид', 'Челси'],
    correctAnswer: 3,
    prize: 125000
  },
  {
    id: 13,
    question: 'В каком периоде и группе стоит раДОН?',
    answers: ['5 период, VI группа', '7 период I группа', '6 период VIII группа', '4 период II группа'],
    correctAnswer: 2,
    prize: 250000
  },
  {
    id: 14,
    question: 'Какой любимый юнит у Дона в старкрафте?',
    answers: ['Осадный танк у Терранов («танк на марше»)', 'Тамплиер у Протоссов («А Дон предаст»)', 'КСМ для сбора минералов у Терранов («КСМ готов, кэп»)', 'Ястреб у Терранов («кто на новенького»)'],
    correctAnswer: 0,
    prize: 500000
  },
  {
    id: 15,
    question: 'Ты выйдешь за меня ?)',
    answers: ['Да!', 'Да да да!', 'Да, конечно!', 'Даааа!!'],
    correctAnswer: 0,
    prize: 1000000
  }
];

export default function Index() {
  const [screen, setScreen] = useState<'menu' | 'game' | 'settings'>('menu');
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [godMode, setGodMode] = useState(false);
  const [infiniteHints, setInfiniteHints] = useState(false);
  const [gameTitle, setGameTitle] = useState('Кто хочет стать самым кумным?');
  const [audioFiles, setAudioFiles] = useState<AudioFiles>({});

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAllAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  const playAudio = (audioUrl: string, loop: boolean = false) => {
    stopAllAudio();
    currentAudioRef.current = new Audio(audioUrl);
    currentAudioRef.current.loop = loop;
    currentAudioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    stopAllAudio();
    
    if (screen === 'menu' && audioFiles.menuTheme) {
      playAudio(audioFiles.menuTheme, true);
    }

    return () => {
      stopAllAudio();
    };
  }, [screen, audioFiles.menuTheme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {screen === 'menu' ? (
        <StartMenu 
          gameTitle={gameTitle}
          onStart={() => setScreen('game')}
          onSettings={() => setScreen('settings')}
        />
      ) : screen === 'game' ? (
        <GameScreen 
          questions={questions}
          godMode={godMode}
          infiniteHints={infiniteHints}
          gameTitle={gameTitle}
          audioFiles={audioFiles}
          currentAudioRef={currentAudioRef}
          playAudio={playAudio}
          stopAllAudio={stopAllAudio}
          onOpenSettings={() => setScreen('settings')}
          onBackToMenu={() => setScreen('menu')}
        />
      ) : (
        <SettingsScreen
          questions={questions}
          godMode={godMode}
          infiniteHints={infiniteHints}
          gameTitle={gameTitle}
          audioFiles={audioFiles}
          onQuestionsChange={setQuestions}
          onGodModeChange={setGodMode}
          onInfiniteHintsChange={setInfiniteHints}
          onGameTitleChange={setGameTitle}
          onAudioFilesChange={setAudioFiles}
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  );
}