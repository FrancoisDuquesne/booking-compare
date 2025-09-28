export interface Estate {
  url: string;
  name: string;
  price: string;
  rating: string;
  location: string;
  image?: string;
}

export interface Vote {
  estateUrl: string;
  voterName: string;
}

export interface Note {
  estateUrl: string;
  voterName: string;
  content: string;
  timestamp: number;
}
