import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player } from '@/types/player';

interface PlayerMatchStatsFormProps {
  formData: Player;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const PlayerMatchStatsForm: React.FC<PlayerMatchStatsFormProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Статистика матчей</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="matches">Матчи</Label>
          <Input 
            id="matches" 
            name="matches" 
            type="number" 
            min="0"
            value={formData.matches} 
            onChange={handleChange}
            placeholder="Количество матчей"
          />
        </div>

        <div>
          <Label htmlFor="goals">Голы</Label>
          <Input 
            id="goals" 
            name="goals" 
            type="number" 
            min="0"
            value={formData.goals} 
            onChange={handleChange}
            placeholder="Количество голов"
          />
      </div>
      
        <div>
          <Label htmlFor="assists">Голевые передачи</Label>
          <Input 
            id="assists" 
            name="assists" 
            type="number" 
            min="0"
            value={formData.assists} 
            onChange={handleChange}
            placeholder="Количество голевых передач"
          />
        </div>

        <div>
          <Label htmlFor="yellowCards">Желтые карточки</Label>
          <Input 
            id="yellowCards" 
            name="yellowCards" 
            type="number" 
            min="0"
            value={formData.yellowCards} 
            onChange={handleChange}
            placeholder="Количество желтых карточек"
          />
        </div>

        <div>
          <Label htmlFor="redCards">Красные карточки</Label>
          <Input 
            id="redCards" 
            name="redCards" 
            type="number" 
            min="0"
            value={formData.redCards} 
            onChange={handleChange}
            placeholder="Количество красных карточек"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerMatchStatsForm;
