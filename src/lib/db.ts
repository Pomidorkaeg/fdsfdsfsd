import { Player, Training, Media, Match, News, Team } from '../types/models';

// This is a mock database service. In a real application, you would use MongoDB or another database
export class DatabaseService {
  private players: Player[] = [];
  private trainings: Training[] = [];
  private media: Media[] = [];
  private matches: Match[] = [];
  private news: News[] = [];
  private teams: Team[] = [];

  constructor() {
    // Load data from localStorage
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedMatches = localStorage.getItem('matches');
    const storedNews = localStorage.getItem('news');
    const storedTeams = localStorage.getItem('teams');
    const storedMedia = localStorage.getItem('media');
    
    if (storedMatches) {
      this.matches = JSON.parse(storedMatches).map((match: any) => ({
        ...match,
        date: new Date(match.date)
      }));
    }
    
    if (storedNews) {
      this.news = JSON.parse(storedNews).map((news: any) => ({
        ...news,
        date: new Date(news.date)
      }));
    }

    if (storedTeams) {
      this.teams = JSON.parse(storedTeams);
    }

    if (storedMedia) {
      this.media = JSON.parse(storedMedia);
    }
  }

  private saveToStorage() {
    localStorage.setItem('matches', JSON.stringify(this.matches));
    localStorage.setItem('news', JSON.stringify(this.news));
    localStorage.setItem('teams', JSON.stringify(this.teams));
    localStorage.setItem('media', JSON.stringify(this.media));
  }

  // Players
  async getPlayers(): Promise<Player[]> {
    return this.players;
  }

  async createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
    const newPlayer = { ...player, id: crypto.randomUUID() };
    this.players.push(newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: string, player: Partial<Player>): Promise<Player> {
    const index = this.players.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Player not found');
    this.players[index] = { ...this.players[index], ...player };
    return this.players[index];
  }

  async deletePlayer(id: string): Promise<void> {
    this.players = this.players.filter(p => p.id !== id);
  }

  // Trainings
  async getTrainings(): Promise<Training[]> {
    return this.trainings;
  }

  async createTraining(training: Omit<Training, 'id'>): Promise<Training> {
    const newTraining = { ...training, id: crypto.randomUUID() };
    this.trainings.push(newTraining);
    return newTraining;
  }

  async updateTraining(id: string, training: Partial<Training>): Promise<Training> {
    const index = this.trainings.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Training not found');
    this.trainings[index] = { ...this.trainings[index], ...training };
    return this.trainings[index];
  }

  async deleteTraining(id: string): Promise<void> {
    this.trainings = this.trainings.filter(t => t.id !== id);
  }

  // Media
  async getMedia(): Promise<Media[]> {
    return this.media;
  }

  async createMedia(media: Omit<Media, 'id'>): Promise<Media> {
    const newMedia = { ...media, id: crypto.randomUUID() };
    this.media.push(newMedia);
    this.saveToStorage();
    return newMedia;
  }

  async updateMedia(id: string, media: Partial<Media>): Promise<Media> {
    const index = this.media.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Media not found');
    this.media[index] = { ...this.media[index], ...media };
    this.saveToStorage();
    return this.media[index];
  }

  async deleteMedia(id: string): Promise<void> {
    this.media = this.media.filter(m => m.id !== id);
    this.saveToStorage();
  }

  async deleteAllMedia(): Promise<void> {
    this.media = [];
    this.saveToStorage();
  }

  // Matches
  async getMatches(): Promise<Match[]> {
    return this.matches;
  }

  async createMatch(match: Omit<Match, 'id'>): Promise<Match> {
    const newMatch = { ...match, id: crypto.randomUUID() };
    this.matches.push(newMatch);
    this.saveToStorage();
    return newMatch;
  }

  async updateMatch(id: string, match: Partial<Match>): Promise<Match> {
    const index = this.matches.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Match not found');
    this.matches[index] = { ...this.matches[index], ...match };
    this.saveToStorage();
    return this.matches[index];
  }

  async deleteMatch(id: string): Promise<void> {
    this.matches = this.matches.filter(m => m.id !== id);
    this.saveToStorage();
  }

  // News
  async getNews(): Promise<News[]> {
    return this.news;
  }

  async createNews(news: Omit<News, 'id'>): Promise<News> {
    const newNews = { ...news, id: crypto.randomUUID() };
    this.news.push(newNews);
    this.saveToStorage();
    return newNews;
  }

  async updateNews(id: string, news: Partial<News>): Promise<News> {
    const index = this.news.findIndex(n => n.id === id);
    if (index === -1) throw new Error('News not found');
    this.news[index] = { ...this.news[index], ...news };
    this.saveToStorage();
    return this.news[index];
  }

  async deleteNews(id: string): Promise<void> {
    this.news = this.news.filter(n => n.id !== id);
    this.saveToStorage();
  }

  async deleteAllNews(): Promise<void> {
    this.news = [];
    this.saveToStorage();
  }

  // Team methods
  async getTeams(): Promise<Team[]> {
    return this.teams;
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.find(team => team.id === id);
  }

  async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
    const newTeam = {
      ...team,
      id: crypto.randomUUID()
    };
    this.teams.push(newTeam);
    this.saveToStorage();
    return newTeam;
  }

  async updateTeam(team: Team): Promise<Team> {
    const index = this.teams.findIndex(t => t.id === team.id);
    if (index === -1) {
      throw new Error('Team not found');
    }
    this.teams[index] = team;
    this.saveToStorage();
    return team;
  }

  async deleteTeam(id: string): Promise<void> {
    const index = this.teams.findIndex(team => team.id === id);
    if (index === -1) {
      throw new Error('Team not found');
    }
    this.teams.splice(index, 1);
    this.saveToStorage();
  }
}

export const db = new DatabaseService(); 