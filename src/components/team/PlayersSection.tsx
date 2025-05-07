import React from 'react';
import { Player } from '@/types/player';
import PlayerCard from '@/components/players/PlayerCard';
import PlayerDetail from '@/components/players/PlayerDetail';
import PositionFilter from '@/components/players/PositionFilter';

interface PlayersSectionProps {
  players: Player[];
  activePosition: string;
  selectedPlayer: Player | null;
  primaryColor: string;
  secondaryColor: string;
  onPositionChange: (position: string) => void;
  onPlayerSelect: (player: Player) => void;
}

const PlayersSection: React.FC<PlayersSectionProps> = ({
  players,
  activePosition,
  selectedPlayer,
  primaryColor,
  secondaryColor,
  onPositionChange,
  onPlayerSelect
}) => {
  // Filter players by position
  const filteredPlayers = activePosition === 'all'
    ? players
    : players.filter(player => player.position === activePosition);

  // Calculate age from birth date
  const calculateAge = (birthDate: string) => {
    const [day, month, year] = birthDate.split('.').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    const ageDifMs = Date.now() - birthDateObj.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div>
      <PositionFilter
        activePosition={activePosition}
        onPositionChange={onPositionChange}
        primaryColor={primaryColor}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {filteredPlayers.map(player => (
          <div key={player.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="grid grid-cols-1">
              <div className="p-0">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={player.image} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="mb-2">
                  <div className="text-sm text-gray-500">{player.position}</div>
                  <h3 className="text-lg font-bold">{player.name}</h3>
                  <div className="text-sm text-gray-600">Возраст: {calculateAge(player.birthDate)} лет</div>
                  <div className="text-sm text-gray-600">Дата рождения: {player.birthDate}</div>
                  <div className="text-sm text-gray-600">Рост: {player.height} см</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500">Матчи</div>
                    <div className="font-bold">{player.matches}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Голы</div>
                    <div className="font-bold">{player.goals}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Передачи</div>
                    <div className="font-bold">{player.assists}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <PlayerDetail
          player={selectedPlayer}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      )}
    </div>
  );
};

export default PlayersSection;
