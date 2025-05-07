import React, { useState, useEffect } from 'react';
import { Edit2, Shield, ImagePlus, Award, MapPin, Info, Star, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTeamsData, updateTeam } from '@/utils/teamsData';
import { Team } from '@/types/team';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Instagram, Facebook, Twitter } from 'lucide-react';
import { db } from '@/lib/db';
import { useToast } from '@/components/ui/use-toast';

const TeamsManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [editedStats, setEditedStats] = useState({
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const teamsData = await db.getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading teams:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить команды",
        });
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setEditedName(team.name);
    setEditedDescription(team.description);
    setEditedAddress(team.address);
    setEditedStats(team.stats || {
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    });
  };
  
  const handleSave = async () => {
    if (!editingTeam) return;
  
    const updatedTeam = {
      ...editingTeam,
      name: editedName,
      description: editedDescription,
      address: editedAddress,
      stats: editedStats
    };

      try {
      await db.updateTeam(updatedTeam);
      setTeams(teams.map(team => team.id === updatedTeam.id ? updatedTeam : team));
        toast({
          title: "Команда обновлена",
          description: "Информация о команде успешно обновлена",
        });
      setEditingTeam(null);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось сохранить изменения",
        });
      }
  };

  const handleCancel = () => {
    setEditingTeam(null);
  };
  
  return (
    <div>
      <Card className="mb-8 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-fc-green" />
            Управление командами
          </CardTitle>
          <CardDescription>
            Настройка информации о командах клуба
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 gap-8">
        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden">
            {editingTeam?.id === team.id ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Редактирование команды</h3>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" /> Отмена
                    </Button>
                    <Button size="sm" onClick={handleSave} className="bg-fc-green hover:bg-fc-darkGreen">
                      <Save className="h-4 w-4 mr-1" /> Сохранить
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название команды</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={editedName} 
                        onChange={(e) => setEditedName(e.target.value)} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shortName">Краткое название</Label>
                      <Input 
                        id="shortName" 
                        name="shortName" 
                        value={team.shortName} 
                        onChange={(e) => {
                          const updatedTeam = {
                            ...team,
                            shortName: e.target.value
                          };
                          setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                        }} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="logo">URL логотипа</Label>
                      <Input 
                        id="logo" 
                        name="logo" 
                        value={team.logo} 
                        onChange={(e) => {
                          const updatedTeam = {
                            ...team,
                            logo: e.target.value
                          };
                          setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                        }} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="backgroundImage">URL фонового изображения</Label>
                      <Input 
                        id="backgroundImage" 
                        name="backgroundImage" 
                        value={team.backgroundImage} 
                        onChange={(e) => {
                          const updatedTeam = {
                            ...team,
                            backgroundImage: e.target.value
                          };
                          setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                        }} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Основной цвет</Label>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: team.primaryColor }}
                          ></div>
                          <Input 
                            id="primaryColor" 
                            name="primaryColor" 
                            value={team.primaryColor} 
                            onChange={(e) => {
                              const updatedTeam = {
                                ...team,
                                primaryColor: e.target.value
                              };
                              setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                            }} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="secondaryColor">Дополнительный цвет</Label>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: team.secondaryColor }}
                          ></div>
                          <Input 
                            id="secondaryColor" 
                            name="secondaryColor" 
                            value={team.secondaryColor} 
                            onChange={(e) => {
                              const updatedTeam = {
                                ...team,
                                secondaryColor: e.target.value
                              };
                              setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={editedDescription} 
                        onChange={(e) => setEditedDescription(e.target.value)} 
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="coach">Главный тренер</Label>
                      <Input 
                        id="coach" 
                        name="coach" 
                        value={team.coach} 
                        onChange={(e) => {
                          const updatedTeam = {
                            ...team,
                            coach: e.target.value
                          };
                          setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                        }} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="foundedYear">Год основания</Label>
                      <Input 
                        id="foundedYear" 
                        name="foundedYear" 
                        type="number"
                        value={team.foundedYear} 
                        onChange={(e) => {
                          const updatedTeam = {
                            ...team,
                            foundedYear: parseInt(e.target.value) || 0
                          };
                          setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                        }} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stadium">Стадион</Label>
                      <Input 
                        id="stadium" 
                        name="stadium" 
                        value={team.stadium} 
                        onChange={(e) => {
                          const updatedTeam = {
                            ...team,
                            stadium: e.target.value
                          };
                          setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                        }} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Адрес</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={editedAddress} 
                        onChange={(e) => setEditedAddress(e.target.value)} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="achievements">Достижения (каждое с новой строки)</Label>
                      <Textarea 
                        id="achievements" 
                        name="achievements" 
                        value={team.achievements.join('\n')} 
                        onChange={(e) => {
                          const updatedTeam = {
                            ...team,
                            achievements: e.target.value.split('\n').filter(item => item.trim() !== '')
                          };
                          setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                        }} 
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-3 border p-4 rounded-md">
                      <Label>Социальные сети</Label>
                      
                      <div>
                        <Label htmlFor="socialLinks.website" className="text-sm">Вебсайт</Label>
                        <Input 
                          id="socialLinks.website" 
                          name="socialLinks.website" 
                          value={team.socialLinks.website || ''} 
                          onChange={(e) => {
                            const updatedTeam = {
                              ...team,
                              socialLinks: {
                                ...team.socialLinks,
                                website: e.target.value
                              }
                            };
                            setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                          }} 
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="socialLinks.instagram" className="text-sm">Instagram</Label>
                        <Input 
                          id="socialLinks.instagram" 
                          name="socialLinks.instagram" 
                          value={team.socialLinks.instagram || ''} 
                          onChange={(e) => {
                            const updatedTeam = {
                              ...team,
                              socialLinks: {
                                ...team.socialLinks,
                                instagram: e.target.value
                              }
                            };
                            setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                          }} 
                          placeholder="https://instagram.com/teamname"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="socialLinks.facebook" className="text-sm">Facebook</Label>
                        <Input 
                          id="socialLinks.facebook" 
                          name="socialLinks.facebook" 
                          value={team.socialLinks.facebook || ''} 
                          onChange={(e) => {
                            const updatedTeam = {
                              ...team,
                              socialLinks: {
                                ...team.socialLinks,
                                facebook: e.target.value
                              }
                            };
                            setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                          }} 
                          placeholder="https://facebook.com/teamname"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="socialLinks.twitter" className="text-sm">Twitter</Label>
                        <Input 
                          id="socialLinks.twitter" 
                          name="socialLinks.twitter" 
                          value={team.socialLinks.twitter || ''} 
                          onChange={(e) => {
                            const updatedTeam = {
                              ...team,
                              socialLinks: {
                                ...team.socialLinks,
                                twitter: e.target.value
                              }
                            };
                            setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
                          }} 
                          placeholder="https://twitter.com/teamname"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="h-48 relative">
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      backgroundImage: `url('${team.backgroundImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(to right, ${team.primaryColor}DD, ${team.secondaryColor}99)`,
                    }}
                  ></div>
                  <div className="absolute inset-0 p-6 flex items-center">
                    <div className="flex items-center">
                      <img 
                        src={team.logo} 
                        alt={team.name} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="ml-6">
                        <h3 className="text-3xl font-bold text-white drop-shadow-md">
                          {team.name}
                        </h3>
                        <p className="text-white text-opacity-90">
                          Основан в {team.foundedYear} году
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleEdit(team)}
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                    >
                      <Edit2 className="h-4 w-4 mr-1" /> Изменить
                    </Button>
                  </div>
                </div>
                
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <Info className="w-5 h-5 mr-2 text-fc-green" />
                        <h4 className="font-semibold">О команде</h4>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {team.description}
                      </p>
                      
                      <div className="flex items-center mt-6 mb-3">
                        <Star className="w-5 h-5 mr-2 text-fc-green" />
                        <h4 className="font-semibold">Стадион</h4>
                      </div>
                      <p className="text-gray-600">
                        {team.stadium}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-3">
                        <Award className="w-5 h-5 mr-2 text-fc-green" />
                        <h4 className="font-semibold">Достижения</h4>
                      </div>
                      <ul className="space-y-2">
                        {team.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-fc-green mt-2 mr-2"></div>
                            <span className="text-gray-600">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center mt-6 mb-3">
                        <MapPin className="w-5 h-5 mr-2 text-fc-green" />
                        <h4 className="font-semibold">Адрес</h4>
                      </div>
                      <p className="text-gray-600">
                        {team.address}
                      </p>
                    </div>
                  </div>
                  
                  {/* Statistics Section */}
                  <div className="mt-8 border-t pt-6">
                    <div className="flex items-center mb-4">
                      <Award className="w-5 h-5 mr-2 text-fc-green" />
                      <h4 className="font-semibold">Статистика команды</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Матчи</div>
                        <div className="text-2xl font-bold text-fc-green">{team.stats?.matches || 0}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Победы</div>
                        <div className="text-2xl font-bold text-green-600">{team.stats?.wins || 0}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Ничьи</div>
                        <div className="text-2xl font-bold text-yellow-600">{team.stats?.draws || 0}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Поражения</div>
                        <div className="text-2xl font-bold text-red-600">{team.stats?.losses || 0}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Забито</div>
                        <div className="text-2xl font-bold text-blue-600">{team.stats?.goalsFor || 0}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Пропущено</div>
                        <div className="text-2xl font-bold text-red-600">{team.stats?.goalsAgainst || 0}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Разница</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {(team.stats?.goalsFor || 0) - (team.stats?.goalsAgainst || 0)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Очки</div>
                        <div className="text-2xl font-bold text-fc-green">{team.stats?.points || 0}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {team.socialLinks.website && (
                        <div className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-700 flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          Сайт
                        </div>
                      )}
                      {team.socialLinks.instagram && (
                        <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-sm text-white flex items-center">
                          <Instagram className="w-4 h-4 mr-1" />
                          Instagram
                        </div>
                      )}
                      {team.socialLinks.facebook && (
                        <div className="px-3 py-1 bg-blue-600 rounded text-sm text-white flex items-center">
                          <Facebook className="w-4 h-4 mr-1" />
                          Facebook
                        </div>
                      )}
                      {team.socialLinks.twitter && (
                        <div className="px-3 py-1 bg-blue-400 rounded text-sm text-white flex items-center">
                          <Twitter className="w-4 h-4 mr-1" />
                          Twitter
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamsManagement;
