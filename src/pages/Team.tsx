import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Player } from '@/types/player';
import { Coach } from '@/types/coach';
import { Team as TeamType } from '@/types/team';
import { getTeamsData } from '@/utils/teamsData';
import { getPlayersByTeam } from '@/utils/players';
import { getCoachesByTeam } from '@/utils/coachesData';
import TeamDetail from '@/components/TeamDetail';
import TeamHeader from '@/components/team/TeamHeader';
import TeamTabs from '@/components/team/TeamTabs';
import PlayersSection from '@/components/team/PlayersSection';
import StaffSection from '@/components/team/StaffSection';

const Team = () => {
  const [activeTab, setActiveTab] = useState('players');
  const [activePosition, setActivePosition] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeTeam, setActiveTeam] = useState<string>('gudauta');
  const [teams, setTeams] = useState<TeamType[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [staff, setStaff] = useState<Coach[]>([]);
  
  useEffect(() => {
    // Load teams data
    const teamsData = getTeamsData();
    setTeams(teamsData);
  }, []);
  
  useEffect(() => {
    // Update players and staff when active team changes
    if (activeTeam) {
      const teamPlayers = getPlayersByTeam(activeTeam);
      const teamStaff = getCoachesByTeam(activeTeam);
      
      setPlayers(teamPlayers);
      setStaff(teamStaff);
      setSelectedPlayer(null);
      setActivePosition('all');
    }
  }, [activeTeam]);
  
  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleTeamChange = (teamId: string) => {
    setActiveTeam(teamId);
    setActiveTab('details'); // Reset to details tab when switching teams
  };

  // Find current team 
  const currentTeam = teams.find(team => team.id === activeTeam);
  
  // Default colors if team not found
  const primaryColor = currentTeam?.primaryColor || '#2e7d32';
  const secondaryColor = currentTeam?.secondaryColor || '#ffeb3b';
  
  // Новый компонент для статистики игроков
  const PlayerStatsTable = ({ players }: { players: Player[] }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
            <th className="py-3 px-4 font-medium">#</th>
            <th className="py-3 px-4 font-medium">Игрок</th>
            <th className="py-3 px-4 font-medium">Позиция</th>
            <th className="py-3 px-4 font-medium">Матчи</th>
            <th className="py-3 px-4 font-medium">Голы</th>
            <th className="py-3 px-4 font-medium">ЖК</th>
            <th className="py-3 px-4 font-medium">КК</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, idx) => (
            <tr key={player.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150">
              <td className="py-3 px-4 text-center">{idx + 1}</td>
              <td className="py-3 px-4 font-medium flex items-center gap-2">
                <img src={player.image} alt={player.name} className="w-8 h-8 rounded-full object-cover" />
                {player.name}
              </td>
              <td className="py-3 px-4 text-center">{player.position}</td>
              <td className="py-3 px-4 text-center">{player.matches}</td>
              <td className="py-3 px-4 text-center">{player.goals}</td>
              <td className="py-3 px-4 text-center">{player.yellowCards}</td>
              <td className="py-3 px-4 text-center">{player.redCards}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 page-transition">
        {/* Header */}
        <TeamHeader 
          teams={teams} 
          activeTeam={activeTeam} 
          onTeamChange={handleTeamChange}
          primaryColor={primaryColor}
        />
        
        {/* Tab Navigation */}
        <TeamTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          primaryColor={primaryColor} 
        />
        
        {/* Content */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {activeTab === 'details' && currentTeam && (
            <TeamDetail team={currentTeam} />
          )}
          
          {activeTab === 'players' && (
            <PlayersSection
              players={players}
              activePosition={activePosition}
              selectedPlayer={selectedPlayer}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              onPositionChange={setActivePosition}
              onPlayerSelect={handlePlayerClick}
            />
          )}
          
          {activeTab === 'staff' && (
            <StaffSection 
              staff={staff} 
              primaryColor={primaryColor} 
            />
          )}
          {activeTab === 'player-stats' && (
            <PlayerStatsTable players={players} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Team;
