import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StartMenuProps {
  gameTitle: string;
  onStart: () => void;
  onSettings: () => void;
}

export default function StartMenu({ gameTitle, onStart, onSettings }: StartMenuProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-12 text-center bg-card/95 backdrop-blur animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-gold/10" />
        
        <div className="relative z-10">
          <Icon name="CircleDollarSign" size={120} className="mx-auto mb-8 text-gold animate-pulse-glow" />
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-4 drop-shadow-glow">
            {gameTitle}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 font-medium">
            Проверь свои знания и выиграй главный приз!
          </p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <Button 
              onClick={onStart}
              size="lg"
              className="w-full text-2xl py-8 font-display bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform shadow-xl"
            >
              <Icon name="Play" size={32} className="mr-3" />
              Начать игру
            </Button>
            
            <Button 
              onClick={onSettings}
              size="lg"
              variant="outline"
              className="w-full text-lg py-6 font-display hover:scale-105 transition-transform"
            >
              <Icon name="Settings" size={24} className="mr-2" />
              Настройки
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
