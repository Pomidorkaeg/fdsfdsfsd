export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  photo: string;
  bio: string;
  stats: {
    goals: number;
    assists: number;
    matches: number;
  };
}

export interface Training {
  id: string;
  date: Date;
  type: string;
  description: string;
  location: string;
  participants: string[]; // Array of player IDs
}

export interface Media {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  date: string;
  category: string;
}

export interface Match {
  id: string;
  date: Date;
  opponent: string;
  location: string;
  score: {
    home: number;
    away: number;
  };
  status: 'upcoming' | 'live' | 'completed';
  highlights?: string[];
}

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  date: Date;
  author: string;
  tags: string[];
  category: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  coach: string;
  foundedYear: number;
  stadium: string;
  address: string;
  achievements: string[];
  socialLinks: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  stats: {
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
} 