import { useState, useRef, useEffect } from 'react';
import GameScreen from '@/components/GameScreen';
import SettingsScreen from '@/components/SettingsScreen';
import StartMenu from '@/components/StartMenu';
import { Question, AudioFiles } from '@/types/game';

const defaultQuestions: Question[] = [
  {
    id: 1,
    question: 'Какой год рождения Турецкого?',
    answers: ['2015', '2016', '2017', '2018'],
    correctAnswer: 2,
    prize: 100
  },
  {
    id: 2,
    question: 'Продолжите текст песни: «10:33 на часах, темные очки на глазах, вороны кружат в облаках..»',
    answers: ['Красные шарфы на кругах', 'Страстные прыжки на коврах', 'Странные круги на полях', 'Стрёмные бабы на кортах'],
    correctAnswer: 2,
    prize: 200
  },
  {
    id: 3,
    question: 'Статья № 221 УК РФ про:',
    answers: ['Вандализм', 'Причинение имущественного ущерба путём обмана или злоупотребления доверием', 'Хищение либо вымогательство ядерных материалов или радиоактивных веществ', 'Нарушение правил хранения, перевозки и использования взрывчатых, легковоспламеняющихся веществ и пиротехнических изделий'],
    correctAnswer: 2,
    prize: 300
  },
  {
    id: 4,
    question: 'Каким словом зумеры называют чрезмерную откровенность собеседника, с которым они не близки?',
    answers: ['Овершеринг', 'Гостинг', 'Пипл плизинг', 'Газлайтинг'],
    correctAnswer: 0,
    prize: 500
  },
  {
    id: 5,
    question: 'Турецкий курортный город, который прославился в инсте',
    answers: ['Кемер', 'Мармарис', 'Коньяалты', 'Каш'],
    correctAnswer: 3,
    prize: 1000
  },
  {
    id: 6,
    question: 'Индийское блюдо сабджи - это',
    answers: ['традиционные треугольные пирожки', 'хрустящие спиральки, приготовленные из жидкого теста', 'овощной суп из бобовых', 'рагу из овощей со специями и пряностями'],
    correctAnswer: 3,
    prize: 2000
  },
  {
    id: 7,
    question: 'Сколько стоит оригинальная эта сумка COACH?',
    answers: ['3000', '20000', '40000', '80000'],
    correctAnswer: -1,
    prize: 4000
  },
  {
    id: 8,
    question: 'В каком случае следователем применяется Цианакрилатная камера?',
    answers: ['Для обнаружения и фиксации скрытых отпечатков пальцев на сложных поверхностях', 'Для поиска спрятанных электронных устройств (телефонов, микрофонов, жучков) в помещении', 'Для извлечения и консервации ДНК с биологических следов, найденных на месте преступления', 'Для сбора и анализа микрочастиц (волокон, пыли, краски) с одежды подозреваемого'],
    correctAnswer: 0,
    prize: 8000
  },
  {
    id: 9,
    question: 'Что за праздник Холи в Индии?',
    answers: ['Фестиваль урожая, отмечаемый в сентябре', 'Фестиваль красок, символизирующий приход весны и победу добра над злом', 'Национальный праздник в честь независимости Индии', 'Религиозный пост и день молитв'],
    correctAnswer: 1,
    prize: 16000
  },
  {
    id: 10,
    question: 'В каком году появилась первая группа Торва ВК?',
    answers: ['2013', '2014', '2015', '2016'],
    correctAnswer: 1,
    prize: 32000
  },
  {
    id: 11,
    question: 'Сколько у Дианы публикаций в инсте?',
    answers: ['77', '66', '69', '60'],
    correctAnswer: 2,
    prize: 64000
  },
  {
    id: 12,
    question: 'До поступления в МХАТ на актера, В. Высоцкий проучился одну сессию по велению отца в:',
    answers: ['инженерно-строительный институт', 'нефтегазовый институт', 'юридический институт', 'астрономический институт'],
    correctAnswer: 0,
    prize: 125000
  },
  {
    id: 13,
    question: 'Какая религия была самой первой?',
    answers: ['Христианство', 'Ислам', 'Буддизм', 'Иудаизм'],
    correctAnswer: 2,
    prize: 250000
  },
  {
    id: 14,
    question: 'Какой химический элемент назван в честь злого подземного гнома?',
    answers: ['Гафний', 'Кобальт', 'Бериллий', 'Теллур'],
    correctAnswer: 1,
    prize: 500000
  },
  {
    id: 15,
    question: 'Реки с каким названием нет на территории России?',
    answers: ['Шея', 'Уста', 'Спина', 'Палец'],
    correctAnswer: 2,
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
  const [typewriterSpeed, setTypewriterSpeed] = useState(0.5);

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
          typewriterSpeed={typewriterSpeed}
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
          typewriterSpeed={typewriterSpeed}
          onQuestionsChange={setQuestions}
          onGodModeChange={setGodMode}
          onInfiniteHintsChange={setInfiniteHints}
          onGameTitleChange={setGameTitle}
          onAudioFilesChange={setAudioFiles}
          onTypewriterSpeedChange={setTypewriterSpeed}
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  );
}