import React, { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { Media } from '../../types/models';
import { EntityForm, FormField } from '../../components/admin/EntityForm';
import { Search, Filter, SortAsc, SortDesc, Image as ImageIcon, Video, Trash2, Edit2, Plus } from 'lucide-react';

const MediaPage: React.FC = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const data = await db.getMedia();
    setMedia(data);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedMedia) {
        await db.updateMedia(selectedMedia.id, data);
      } else {
        await db.createMedia(data);
      }
      await loadMedia();
      setIsEditing(false);
      setSelectedMedia(null);
    } catch (error) {
      console.error('Error saving media:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот медиафайл?')) {
      try {
        await db.deleteMedia(id);
        await loadMedia();
      } catch (error) {
        console.error('Error deleting media:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Удалить все медиа?')) {
      try {
        await db.deleteAllMedia();
        await loadMedia();
      } catch (error) {
        console.error('Error deleting all media:', error);
      }
    }
  };

  const filteredMedia = media
    .filter(item => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление медиа</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedMedia(null);
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Добавить медиа
          </button>
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
          >
            <Trash2 size={20} />
            Удалить все
          </button>
        </div>
      </div>

      {!isEditing && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'image' | 'video')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все типы</option>
              <option value="image">Только фото</option>
              <option value="video">Только видео</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
            </button>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <EntityForm
            title={selectedMedia ? 'Редактировать медиа' : 'Добавить медиа'}
            onSubmit={handleSubmit}
            initialData={selectedMedia}
            onCancel={() => {
              setIsEditing(false);
              setSelectedMedia(null);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="Заголовок" name="title" required defaultValue={selectedMedia?.title} />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Тип</label>
                  <select
                    name="type"
                    defaultValue={selectedMedia?.type || 'image'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="image">Фото</option>
                    <option value="video">Видео</option>
                  </select>
                </div>
                <FormField label="URL" name="url" required defaultValue={selectedMedia?.url} />
                <FormField label="Превью (thumbnail)" name="thumbnail" required defaultValue={selectedMedia?.thumbnail} />
              </div>
              <div className="space-y-4">
                <FormField label="Дата" name="date" type="date" required defaultValue={selectedMedia?.date} />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Категория</label>
                  <select
                    name="category"
                    defaultValue={selectedMedia?.category || 'match'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="match">Матч</option>
                    <option value="training">Тренировка</option>
                    <option value="interview">Интервью</option>
                    <option value="stadium">Стадион</option>
                    <option value="academy">Академия</option>
                  </select>
                </div>
                {selectedMedia?.thumbnail && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Предпросмотр</label>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={selectedMedia.thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </EntityForm>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Video className="text-white w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'image' ? 'bg-blue-500' : 'bg-red-500'
                  } text-white`}>
                    {item.type === 'image' ? 'Фото' : 'Видео'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {item.category === 'match' ? 'Матч' :
                   item.category === 'training' ? 'Тренировка' :
                   item.category === 'interview' ? 'Интервью' :
                   item.category === 'stadium' ? 'Стадион' : 'Академия'}
                </p>
                <p className="text-sm text-gray-500 mb-4">{new Date(item.date).toLocaleDateString()}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedMedia(item);
                      setIsEditing(true);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaPage; 