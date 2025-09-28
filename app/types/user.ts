export interface UserStats {
  votesCast: number;
  notesWritten: number;
  tripsCompleted: number;
  groupsJoined: number;
}

export interface UserTrip {
  id: string;
  destination: string;
  accommodation: string;
  platform: string;
  checkIn: string;
  checkOut: string;
  status: "Confirmed" | "Draft" | "Planning";
}

export interface UserActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  context?: string;
}

export interface UserSavedSearch {
  id: string;
  title: string;
  filters: string[];
}

export interface CommunicationPreference {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
  timezone: string;
  phoneNumber: string;
  joinDate: string;
  preferredCurrency: string;
  preferredPlatforms: string[];
  stats: UserStats;
  upcomingTrips: UserTrip[];
  recentActivity: UserActivity[];
  savedSearches: UserSavedSearch[];
  communicationPreferences: CommunicationPreference[];
}
