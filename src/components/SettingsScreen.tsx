import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Question, AudioFiles } from '@/types/game';
import { toast } from 'sonner';

interface SettingsScreenProps {
  questions: Question[];
  godMode: boolean;
  infiniteHints: boolean;
  gameTitle: string;
  audioFiles: AudioFiles;
  typewriterSpeed: number;
  onQuestionsChange: (questions: Question[]) => void;
  onGodModeChange: (enabled: boolean) => void;
  onInfiniteHintsChange: (enabled: boolean) => void;
  onGameTitleChange: (title: string) => void;
  onAudioFilesChange: (files: AudioFiles) => void;
  onTypewriterSpeedChange: (speed: number) => void;
  onBack: () => void;
}

export default function SettingsScreen({
  questions,
  godMode,
  infiniteHints,
  gameTitle,
  audioFiles,
  typewriterSpeed,
  onQuestionsChange,
  onGodModeChange,
  onInfiniteHintsChange,
  onGameTitleChange,
  onAudioFilesChange,
  onTypewriterSpeedChange,
  onBack
}: SettingsScreenProps) {
  const [editingQuestions, setEditingQuestions] = useState<Question[]>(questions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>(gameTitle);

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updated = [...editingQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setEditingQuestions(updated);
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
    const updated = [...editingQuestions];
    const answers = [...updated[questionIndex].answers];
    answers[answerIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], answers };
    setEditingQuestions(updated);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: editingQuestions.length + 1,
      question: 'Новый вопрос',
      answers: ['Вариант A', 'Вариант B', 'Вариант C', 'Вариант D'],
      correctAnswer: 0,
      prize: editingQuestions.length > 0 
        ? editingQuestions[editingQuestions.length - 1].prize * 2 
        : 100
    };
    setEditingQuestions([...editingQuestions, newQuestion]);
    setEditingIndex(editingQuestions.length);
  };

  const deleteQuestion = (index: number) => {
    if (editingQuestions.length <= 1) {
      toast.error('Должен остаться хотя бы один вопрос');
      return;
    }
    const updated = editingQuestions.filter((_, i) => i !== index);
    setEditingQuestions(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleAudioUpload = (key: keyof AudioFiles, file: File) => {
    const url = URL.createObjectURL(file);
    onAudioFilesChange({ ...audioFiles, [key]: url });
    toast.success(`Аудио для "${getAudioLabel(key)}" загружено!`);
  };

  const getAudioLabel = (key: keyof AudioFiles): string => {
    const labels = {
      wrongAnswer: 'Неправильный ответ',
      correctAnswer: 'Правильный ответ',
      phoneCall: 'Звонок другу',
      fiftyFifty: '50:50',
      questionTheme: 'Фоновая музыка вопроса',
      answerSelected: 'Выбор ответа',
      menuTheme: 'Музыка меню',
      finalQuestionTheme: 'Музыка 15-го вопроса'
    };
    return labels[key] || key;
  };

  const saveChanges = () => {
    onQuestionsChange(editingQuestions);
    onGameTitleChange(editingTitle);
    toast.success('Настройки сохранены!');
    onBack();
  };

  const cancelChanges = () => {
    setEditingQuestions(questions);
    setEditingTitle(gameTitle);
    onBack();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary flex items-center gap-3">
            <Icon name="Settings" size={40} className="text-gold" />
            Настройки игры
          </h1>
          <Button onClick={cancelChanges} variant="ghost" size="lg">
            <Icon name="X" size={20} className="mr-2" />
            Закрыть
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-card/95 backdrop-blur animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Type" size={24} className="text-primary" />
                Название игры
              </h2>
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                placeholder="Введите название игры"
                className="text-lg font-display font-semibold"
              />
            </div>
          </Card>

          <Card className="p-6 bg-card/95 backdrop-blur animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="Crown" size={24} className="text-gold" />
                    Режим Бога
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Игра не заканчивается при неправильном ответе
                  </p>
                </div>
                <Switch
                  checked={godMode}
                  onCheckedChange={onGodModeChange}
                  className="data-[state=checked]:bg-gold"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="Sparkles" size={24} className="text-secondary" />
                    Бесконечные подсказки
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Подсказки не заканчиваются и можно использовать сколько угодно раз
                  </p>
                </div>
                <Switch
                  checked={infiniteHints}
                  onCheckedChange={onInfiniteHintsChange}
                  className="data-[state=checked]:bg-secondary"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/95 backdrop-blur animate-fade-in">
            <h2 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-2">
              <Icon name="Music" size={24} className="text-primary" />
              Звуковое оформление
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {(['wrongAnswer', 'correctAnswer', 'phoneCall', 'fiftyFifty', 'questionTheme', 'answerSelected', 'menuTheme', 'finalQuestionTheme'] as Array<keyof AudioFiles>).map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`audio-${key}`} className="text-foreground flex items-center gap-2">
                    <Icon name="Volume2" size={16} className="text-muted-foreground" />
                    {getAudioLabel(key)}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`audio-${key}`}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAudioUpload(key, file);
                      }}
                      className="flex-1"
                    />
                    {audioFiles[key] && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const audio = new Audio(audioFiles[key]);
                          audio.play().catch(() => {});
                        }}
                      >
                        <Icon name="Play" size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-card/95 backdrop-blur animate-fade-in">
            <h2 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-2">
              <Icon name="Clock" size={24} className="text-primary" />
              Эффект печатной машинки (15-ый вопрос)
            </h2>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground flex items-center gap-2 mb-2">
                  <Icon name="Timer" size={16} className="text-muted-foreground" />
                  Скорость появления одного слова: {typewriterSpeed} сек
                </Label>
                <Input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={typewriterSpeed}
                  onChange={(e) => onTypewriterSpeedChange(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Быстро (0.1с)</span>
                  <span>Медленно (2с)</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/95 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
                <Icon name="HelpCircle" size={24} className="text-primary" />
                Вопросы ({editingQuestions.length})
              </h2>
              <Button onClick={addQuestion} size="sm" className="font-display">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить вопрос
              </Button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {editingQuestions.map((q, qIndex) => (
                <Card 
                  key={qIndex} 
                  className={`p-4 transition-all duration-300 ${
                    editingIndex === qIndex 
                      ? 'border-2 border-primary shadow-lg' 
                      : 'border border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <button
                      onClick={() => setEditingIndex(editingIndex === qIndex ? null : qIndex)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-gold text-lg">
                          #{qIndex + 1}
                        </span>
                        <span className="font-medium text-foreground">
                          {q.question}
                        </span>
                        <span className="ml-auto text-sm font-display text-gold">
                          {q.prize.toLocaleString()} ₽
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => setEditingIndex(editingIndex === qIndex ? null : qIndex)}
                        variant="ghost"
                        size="sm"
                      >
                        <Icon 
                          name={editingIndex === qIndex ? "ChevronUp" : "ChevronDown"} 
                          size={18} 
                        />
                      </Button>
                      <Button
                        onClick={() => deleteQuestion(qIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  </div>

                  {editingIndex === qIndex && (
                    <div className="space-y-4 animate-accordion-down">
                      <div>
                        <Label htmlFor={`question-${qIndex}`} className="text-foreground">
                          Текст вопроса
                        </Label>
                        <Input
                          id={`question-${qIndex}`}
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                          className="mt-2 font-medium"
                        />
                      </div>

                      <div>
                        <Label className="text-foreground mb-2 block">Варианты ответов</Label>
                        <div className="space-y-2">
                          {q.answers.map((answer, aIndex) => (
                            <div key={aIndex} className="flex items-center gap-3">
                              <span className="font-display font-bold text-gold w-8">
                                {['A', 'B', 'C', 'D'][aIndex]}:
                              </span>
                              <Input
                                value={answer}
                                onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                className="flex-1"
                              />
                              <button
                                onClick={() => handleQuestionChange(qIndex, 'correctAnswer', aIndex)}
                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                  q.correctAnswer === aIndex
                                    ? 'bg-green-600 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                }`}
                              >
                                {q.correctAnswer === aIndex ? (
                                  <Icon name="Check" size={18} />
                                ) : (
                                  'Верный'
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`prize-${qIndex}`} className="text-foreground">
                          Сумма выигрыша (₽)
                        </Label>
                        <Input
                          id={`prize-${qIndex}`}
                          type="number"
                          value={q.prize}
                          onChange={(e) => handleQuestionChange(qIndex, 'prize', parseInt(e.target.value) || 0)}
                          className="mt-2 font-display font-bold"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`congratulation-${qIndex}`} className="text-foreground">
                          Поздравление (необязательно)
                        </Label>
                        <Textarea
                          id={`congratulation-${qIndex}`}
                          value={q.congratulation || ''}
                          onChange={(e) => handleQuestionChange(qIndex, 'congratulation', e.target.value || undefined)}
                          placeholder="Введите уникальное поздравление для этого вопроса..."
                          className="mt-2 min-h-[80px]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Появится при правильном ответе на этот вопрос
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button onClick={cancelChanges} variant="outline" size="lg" className="font-display">
              <Icon name="X" size={20} className="mr-2" />
              Отмена
            </Button>
            <Button onClick={saveChanges} size="lg" className="font-display">
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить и вернуться
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}