import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Question, Lifeline } from '@/types/game';
import { toast } from 'sonner';

interface GameScreenProps {
  questions: Question[];
  godMode: boolean;
  gameTitle: string;
  onOpenSettings: () => void;
}

export default function GameScreen({ questions, godMode, gameTitle, onOpenSettings }: GameScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState(0);
  
  const [lifelines, setLifelines] = useState<Lifeline>({
    fiftyFifty: true,
    phoneCall: true,
    audienceHelp: true
  });
  
  const [removedAnswers, setRemovedAnswers] = useState<number[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const prizeList = questions.map(q => q.prize);

  const handleAnswerClick = (answerIndex: number) => {
    if (showResult || removedAnswers.includes(answerIndex)) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setTotalWinnings(currentQuestion.prize);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setRemovedAnswers([]);
        } else {
          setGameOver(true);
          toast.success('🎉 Поздравляем! Вы выиграли миллион!');
        }
      }, 2000);
    } else {
      if (godMode) {
        toast.info('Режим Бога: игра продолжается!');
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowResult(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setGameOver(true);
          toast.error('Игра окончена!');
        }, 2000);
      }
    }
  };

  const handleFiftyFifty = () => {
    if (!lifelines.fiftyFifty || showResult) return;
    
    const incorrectAnswers = currentQuestion.answers
      .map((_, index) => index)
      .filter(index => index !== currentQuestion.correctAnswer);
    
    const toRemove = incorrectAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
    setRemovedAnswers(toRemove);
    setLifelines({ ...lifelines, fiftyFifty: false });
    toast.success('50/50 использовано!');
  };

  const handlePhoneCall = () => {
    if (!lifelines.phoneCall || showResult) return;
    
    const confidence = Math.random() > 0.3 ? 'уверен' : 'думаю';
    const answerLabel = ['A', 'B', 'C', 'D'][currentQuestion.correctAnswer];
    toast.success(`Друг ${confidence}, что правильный ответ: ${answerLabel}`);
    setLifelines({ ...lifelines, phoneCall: false });
  };

  const handleAudienceHelp = () => {
    if (!lifelines.audienceHelp || showResult) return;
    
    const percentage = 55 + Math.floor(Math.random() * 30);
    const answerLabel = ['A', 'B', 'C', 'D'][currentQuestion.correctAnswer];
    toast.success(`${percentage}% зрителей выбрали ответ ${answerLabel}`);
    setLifelines({ ...lifelines, audienceHelp: false });
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setTotalWinnings(0);
    setLifelines({ fiftyFifty: true, phoneCall: true, audienceHelp: true });
    setRemovedAnswers([]);
  };

  const getAnswerClass = (index: number) => {
    const baseClass = 'group relative w-full p-5 text-left text-base md:text-lg font-medium transition-all duration-500';
    const bgGradient = 'bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-900/80';
    const border = 'border-2 border-blue-400/40';
    const shape = 'rounded-none';
    const clipPath = 'clip-answer';
    
    if (removedAnswers.includes(index)) {
      return `${baseClass} ${shape} opacity-20 cursor-not-allowed bg-gray-800/40 border-gray-600/30`;
    }
    
    if (showResult) {
      if (index === currentQuestion.correctAnswer) {
        return `${baseClass} ${shape} bg-gradient-to-r from-green-600 via-green-500 to-green-600 border-green-300 text-white shadow-[0_0_30px_rgba(34,197,94,0.6)]`;
      }
      if (index === selectedAnswer && !isCorrect) {
        return `${baseClass} ${shape} bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-red-400 text-white`;
      }
    }
    
    if (selectedAnswer === index && !showResult) {
      return `${baseClass} ${shape} ${bgGradient} ${border} text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] scale-102`;
    }
    
    return `${baseClass} ${shape} ${bgGradient} ${border} text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:scale-102 hover:border-blue-300/60`;
  };

  if (gameOver) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-2xl w-full p-12 text-center bg-gradient-to-br from-blue-950/80 to-blue-900/80 backdrop-blur-xl rounded-2xl border border-blue-400/30 shadow-2xl animate-fade-in">
          <div className="mb-8">
            {totalWinnings === questions[questions.length - 1].prize ? (
              <>
                <Icon name="Trophy" size={100} className="mx-auto mb-6 text-gold animate-pulse-glow" style={{
                  filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))'
                }} />
                <h1 className="text-5xl font-display font-bold text-gold mb-4" style={{
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.6)'
                }}>
                  🎉 Поздравляем! 🎉
                </h1>
                <p className="text-3xl text-white font-display">Вы выиграли {questions[questions.length - 1].prize.toLocaleString()} ₽!</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-6">😢</div>
                <h1 className="text-4xl font-display font-bold text-white mb-4">
                  Игра окончена
                </h1>
                <p className="text-2xl text-blue-200 font-display">
                  Ваш выигрыш: {totalWinnings.toLocaleString()} ₽
                </p>
              </>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={resetGame} 
              size="lg"
              className="w-full text-xl font-display py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
            >
              <Icon name="RotateCcw" size={24} className="mr-2" />
              Начать заново
            </Button>
            <Button 
              onClick={onOpenSettings} 
              size="lg" 
              variant="outline"
              className="w-full text-xl font-display py-6 border-2 border-blue-400/50 text-white hover:bg-blue-400/10"
            >
              <Icon name="Settings" size={24} className="mr-2" />
              Настройки
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 animate-fade-in">
            <div className="flex-1 text-center">
              <h1 className="text-2xl md:text-4xl font-display font-bold text-gold mb-1" style={{
                textShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)'
              }}>
                {gameTitle}
              </h1>
              {godMode && (
                <div className="flex items-center justify-center gap-2 text-gold/80 text-xs font-medium mt-1">
                  <Icon name="Crown" size={14} />
                  Режим Бога
                </div>
              )}
            </div>
            <Button 
              onClick={onOpenSettings}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-gold/60 hover:text-gold hover:bg-gold/10"
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-950/50 to-blue-900/50 backdrop-blur-xl rounded-xl p-8 border border-blue-400/20 shadow-2xl animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-gold via-yellow-400 to-gold text-[#0a0e27] px-6 py-2 rounded-full font-display font-bold text-sm mb-4" style={{
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)'
                }}>
                  Вопрос {currentQuestionIndex + 1} из {questions.length}
                </div>
              </div>
              
              <h2 className="text-xl md:text-2xl font-display font-semibold mb-10 text-white text-center leading-relaxed px-4">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={showResult || removedAnswers.includes(index)}
                    className={getAnswerClass(index)}
                    style={{
                      clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)'
                    }}
                  >
                    <span className="font-display font-bold mr-3 text-gold text-lg">
                      {['A', 'B', 'C', 'D'][index]}:
                    </span>
                    <span className="text-white">{answer}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleFiftyFifty}
                disabled={(!lifelines.fiftyFifty && !godMode) || showResult}
                className={`group relative w-20 h-20 rounded-full transition-all duration-300 ${
                  lifelines.fiftyFifty || godMode
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:scale-110 hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]'
                    : 'bg-gray-700/50 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">50:50</span>
                </div>
                {godMode && !lifelines.fiftyFifty && (
                  <div className="absolute -top-1 -right-1 bg-gold rounded-full p-1">
                    <Icon name="Infinity" size={12} />
                  </div>
                )}
              </button>
              
              <button
                onClick={handlePhoneCall}
                disabled={(!lifelines.phoneCall && !godMode) || showResult}
                className={`group relative w-20 h-20 rounded-full transition-all duration-300 ${
                  lifelines.phoneCall || godMode
                    ? 'bg-gradient-to-br from-green-500 to-green-600 hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]'
                    : 'bg-gray-700/50 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="Phone" size={28} className="text-white" />
                </div>
                {godMode && !lifelines.phoneCall && (
                  <div className="absolute -top-1 -right-1 bg-gold rounded-full p-1">
                    <Icon name="Infinity" size={12} />
                  </div>
                )}
              </button>
              
              <button
                onClick={handleAudienceHelp}
                disabled={(!lifelines.audienceHelp && !godMode) || showResult}
                className={`group relative w-20 h-20 rounded-full transition-all duration-300 ${
                  lifelines.audienceHelp || godMode
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:scale-110 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                    : 'bg-gray-700/50 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="Users" size={28} className="text-white" />
                </div>
                {godMode && !lifelines.audienceHelp && (
                  <div className="absolute -top-1 -right-1 bg-gold rounded-full p-1">
                    <Icon name="Infinity" size={12} />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="lg:block">
            <div className="bg-gradient-to-br from-blue-950/60 to-blue-900/60 backdrop-blur-xl rounded-xl p-4 border border-blue-400/20 shadow-2xl sticky top-8">
              <div className="space-y-1.5">
                {prizeList.slice().reverse().map((prize, reverseIndex) => {
                  const index = prizeList.length - 1 - reverseIndex;
                  const isCurrentQuestion = index === currentQuestionIndex;
                  const isPassed = index < currentQuestionIndex;
                  const isMilestone = [4, 9, 14].includes(index);
                  
                  return (
                    <div
                      key={index}
                      className={`relative px-4 py-2.5 font-display font-bold text-sm transition-all duration-500 ${
                        isCurrentQuestion
                          ? 'bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-white scale-105 shadow-[0_0_20px_rgba(249,115,22,0.6)]'
                          : isPassed
                          ? 'bg-gradient-to-r from-gray-700/60 to-gray-600/60 text-gray-400'
                          : 'bg-gradient-to-r from-blue-900/40 to-blue-800/40 text-blue-200'
                      } ${isMilestone ? 'border-2 border-gold/50' : ''}`}
                      style={{
                        clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`${isCurrentQuestion ? 'text-base' : 'text-xs'} ${isPassed ? 'line-through' : ''}`}>
                          {index + 1}
                        </span>
                        <span className={`${isCurrentQuestion ? 'text-base tracking-wide' : 'text-xs'} ${isMilestone ? 'text-gold' : ''}`}>
                          {prize.toLocaleString()} ₽
                        </span>
                      </div>
                      {isMilestone && !isPassed && (
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gold rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}