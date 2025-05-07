
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Pencil, Trash, Briefcase, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CoachEditor from './CoachEditor';
import { getCoachesByTeam, getCoachById, updateCoach, deleteCoach, createCoach } from '@/utils/coachesData';
import { getTeamById } from '@/utils/teamsData';
import { Coach } from '@/types/coach';
import { toast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const CoachesManagement = () => {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('team') || 'gudauta';
  
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);
  
  const team = getTeamById(teamId);
  
  useEffect(() => {
    // Load coaches for the selected team
    const teamCoaches = getCoachesByTeam(teamId);
    setCoaches(teamCoaches);
  }, [teamId]);
  
  const filteredCoaches = coaches.filter(coach => 
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (coach: Coach) => {
    setCurrentCoach(coach);
    setEditMode(true);
  };
  
  const handleDelete = (coachId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого тренера?')) {
      try {
        deleteCoach(coachId);
        setCoaches(coaches.filter(c => c.id !== coachId));
        toast({
          title: "Тренер удален",
          description: "Тренер был успешно удален из системы",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить тренера",
        });
      }
    }
  };
  
  const handleAddNew = () => {
    const newCoach: Coach = {
      id: `coach-${Date.now()}`,
      name: '',
      role: 'Тренер',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      since: new Date().getFullYear().toString(),
      experience: 0,
      biography: '',
      teamId: teamId
    };
    setCurrentCoach(newCoach);
    setEditMode(true);
  };
  
  const handleSave = (updatedCoach: Coach) => {
    try {
      if (coaches.some(c => c.id === updatedCoach.id)) {
        // Update existing coach
        updateCoach(updatedCoach);
        setCoaches(coaches.map(c => c.id === updatedCoach.id ? updatedCoach : c));
        toast({
          title: "Тренер обновлен",
          description: "Информация о тренере успешно обновлена",
        });
      } else {
        // Create new coach
        createCoach(updatedCoach);
        setCoaches([...coaches, updatedCoach]);
        toast({
          title: "Тренер добавлен",
          description: "Новый тренер успешно добавлен в систему",
        });
      }
      setEditMode(false);
      setCurrentCoach(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
      });
    }
  };
  
  const handleCancel = () => {
    setEditMode(false);
    setCurrentCoach(null);
  };
  
  return (
    <div>
      <Card className="mb-8 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center"
                style={{ backgroundColor: team?.primaryColor || '#2e7d32' }}
              >
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span>Управление тренерами: {team?.name || 'Команда'}</span>
            </div>
          </CardTitle>
          <Button onClick={handleAddNew} className="bg-fc-green hover:bg-fc-darkGreen">
            <Plus className="mr-2 h-4 w-4" /> Добавить тренера
          </Button>
        </CardHeader>
      </Card>
      
      {editMode && currentCoach ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {currentCoach.id.includes('coach-') && !coaches.some(c => c.id === currentCoach.id) 
                ? 'Добавить нового тренера' 
                : 'Редактировать тренера'
              }
            </h2>
          </div>
          
          <CoachEditor 
            coach={currentCoach} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Поиск тренеров по имени или должности..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <div 
                key={coach.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="relative h-48">
                  <img 
                    src={coach.image} 
                    alt={coach.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs font-medium text-white/70 mb-1">
                      {coach.role}
                    </div>
                    <h3 className="text-xl font-bold text-white">{coach.name}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">С {coach.since} года</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{coach.experience} лет опыта</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {coach.biography}
                  </p>
                  
                  <div className="flex justify-end space-x-2 mt-auto">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(coach)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(coach.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCoaches.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-500">
                  Тренеры не найдены. Добавьте первого тренера!
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CoachesManagement;
