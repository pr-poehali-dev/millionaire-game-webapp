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
  const [guaranteedWinnings, setGuaranteedWinnings] = useState(0);
  
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
      
      if (currentQuestion.congratulation) {
        toast.success(currentQuestion.congratulation, { duration: 4000 });
      }
      
      if (currentQuestionIndex === 4 || currentQuestionIndex === 9) {
        setGuaranteedWinnings(currentQuestion.prize);
        toast.success(`💰 Несгораемая сумма: ${currentQuestion.prize.toLocaleString()} ₽`, { duration: 3000 });
      }
      
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setRemovedAnswers([]);
        } else {
          setGameOver(true);
          if (currentQuestion.congratulation) {
            toast.success(currentQuestion.congratulation, { duration: 5000 });
          } else {
            toast.success('🎉 Поздравляем! Вы выиграли миллион!');
          }
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
          const finalWinnings = guaranteedWinnings;
          setTotalWinnings(finalWinnings);
          toast.error(`Игра окончена! Вы уносите: ${finalWinnings.toLocaleString()} ₽`);
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
    setGuaranteedWinnings(0);
    setLifelines({ fiftyFifty: true, phoneCall: true, audienceHelp: true });
    setRemovedAnswers([]);
  };

  const getAnswerClass = (index: number) => {
    const baseClass = 'w-full p-4 text-left text-lg font-medium transition-all duration-300 border-2 rounded-lg';
    
    if (removedAnswers.includes(index)) {
      return `${baseClass} opacity-30 cursor-not-allowed bg-muted/20 border-muted/30`;
    }
    
    if (showResult) {
      if (index === currentQuestion.correctAnswer) {
        return `${baseClass} bg-green-600 border-green-400 text-white animate-pulse-glow`;
      }
      if (index === selectedAnswer && !isCorrect) {
        return `${baseClass} bg-destructive border-destructive text-white`;
      }
    }
    
    if (selectedAnswer === index && !showResult) {
      return `${baseClass} bg-primary border-primary text-white scale-105`;
    }
    
    return `${baseClass} bg-card hover:bg-primary/20 hover:border-primary border-border hover:scale-102`;
  };

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center bg-card/95 backdrop-blur animate-fade-in">
          <div className="mb-6">
            {totalWinnings === questions[questions.length - 1].prize ? (
              <>
                <Icon name="Trophy" size={80} className="mx-auto mb-4 text-gold animate-pulse-glow" />
                <h1 className="text-4xl font-display font-bold text-gold mb-2">
                  🎉 Поздравляем! 🎉
                </h1>
                <p className="text-2xl text-foreground">Вы выиграли миллион!</p>
              </>
            ) : (
              <>
                <Icon name="CircleX" size={80} className="mx-auto mb-4 text-destructive" />
                <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                  Игра окончена
                </h1>
                <p className="text-2xl text-muted-foreground">
                  Ваш выигрыш: {totalWinnings.toLocaleString()} ₽
                </p>
              </>
            )}
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={resetGame} 
              size="lg"
              className="w-full text-lg font-display bg-primary hover:bg-primary/90"
            >
              <Icon name="RotateCcw" size={20} className="mr-2" />
              Начать заново
            </Button>
            <Button 
              onClick={onOpenSettings} 
              size="lg" 
              variant="outline"
              className="w-full text-lg font-display"
            >
              <Icon name="Settings" size={20} className="mr-2" />
              Настройки
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8 animate-fade-in">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary mb-2 flex items-center gap-3">
              <Icon name="CircleDollarSign" size={48} className="text-gold" />
              {gameTitle}
            </h1>
            {godMode && (
              <div className="flex items-center gap-2 text-gold text-sm font-medium mt-2">
                <Icon name="Crown" size={16} />
                Режим Бога активен
              </div>
            )}
          </div>
          <Button 
            onClick={onOpenSettings}
            variant="outline"
            size="lg"
            className="font-display"
          >
            <Icon name="Settings" size={20} className="mr-2" />
            Настройки
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/95 backdrop-blur animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Вопрос {currentQuestionIndex + 1} из {questions.length}
                </span>
                <span className="text-lg font-display font-bold text-gold">
                  {currentQuestion.prize.toLocaleString()} ₽
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-8 text-foreground">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={showResult || removedAnswers.includes(index)}
                    className={getAnswerClass(index)}
                  >
                    <span className="font-display font-bold mr-3 text-gold">
                      {['A', 'B', 'C', 'D'][index]}:
                    </span>
                    {answer}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card/95 backdrop-blur">
              <h3 className="text-lg font-display font-semibold mb-4 text-foreground flex items-center gap-2">
                <Icon name="LifeBuoy" size={24} className="text-primary" />
                Подсказки
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleFiftyFifty}
                  disabled={!lifelines.fiftyFifty || showResult}
                  variant={lifelines.fiftyFifty ? "default" : "outline"}
                  size="lg"
                  className={`flex-1 font-display ${godMode && !lifelines.fiftyFifty ? 'opacity-100' : ''}`}
                >
                  <Icon name="Divide" size={20} className="mr-2" />
                  50/50
                  {godMode && !lifelines.fiftyFifty && (
                    <Icon name="RotateCw" size={16} className="ml-2" />
                  )}
                </Button>
                
                <Button
                  onClick={handlePhoneCall}
                  disabled={!lifelines.phoneCall || showResult}
                  variant={lifelines.phoneCall ? "default" : "outline"}
                  size="lg"
                  className={`flex-1 font-display ${godMode && !lifelines.phoneCall ? 'opacity-100' : ''}`}
                >
                  <Icon name="Phone" size={20} className="mr-2" />
                  Звонок другу
                  {godMode && !lifelines.phoneCall && (
                    <Icon name="RotateCw" size={16} className="ml-2" />
                  )}
                </Button>
                
                <Button
                  onClick={handleAudienceHelp}
                  disabled={!lifelines.audienceHelp || showResult}
                  variant={lifelines.audienceHelp ? "default" : "outline"}
                  size="lg"
                  className={`flex-1 font-display ${godMode && !lifelines.audienceHelp ? 'opacity-100' : ''}`}
                >
                  <Icon name="Users" size={20} className="mr-2" />
                  Помощь зала
                  {godMode && !lifelines.audienceHelp && (
                    <Icon name="RotateCw" size={16} className="ml-2" />
                  )}
                </Button>
              </div>
              {godMode && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  В режиме Бога подсказки доступны бесконечно
                </p>
              )}
            </Card>
          </div>

          <div className="lg:block">
            <Card className="p-4 bg-card/95 backdrop-blur sticky top-8">
              <h3 className="text-lg font-display font-semibold mb-4 text-center text-gold flex items-center justify-center gap-2">
                <Icon name="TrendingUp" size={20} />
                Призовая лестница
              </h3>
              <div className="space-y-2">
                {prizeList.map((prize, index) => {
                  const isCurrentQuestion = index === currentQuestionIndex;
                  const isPassed = index < currentQuestionIndex;
                  const isGuaranteed = index === 4 || index === 9;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-center font-display font-semibold transition-all duration-300 ${
                        isCurrentQuestion
                          ? 'bg-primary text-primary-foreground scale-105 shadow-lg animate-pulse-glow'
                          : isPassed
                          ? 'bg-green-600/30 text-green-200 border border-green-500/50'
                          : 'bg-muted/30 text-muted-foreground'
                      } ${isGuaranteed ? 'border-2 border-gold' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm flex items-center gap-1">
                          {index + 1}
                          {isGuaranteed && <Icon name="Shield" size={14} className="text-gold" />}
                        </span>
                        <span className={isCurrentQuestion ? 'text-lg' : ''}>
                          {prize.toLocaleString()} ₽
                        </span>
                        {isPassed && <Icon name="Check" size={16} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}