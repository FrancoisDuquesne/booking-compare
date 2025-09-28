import type { UserProfile } from "~/types/user";

export const mockUser: UserProfile = {
  id: "user-001",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatarUrl: "https://i.pravatar.cc/160?img=49",
  bio: "Group travel organizer who loves finding unique stays with enough space for everyone.",
  location: "Barcelona, Spain",
  timezone: "Central European Time (GMT+1)",
  phoneNumber: "+34 612 345 678",
  joinDate: "2023-02-14",
  preferredCurrency: "EUR",
  preferredPlatforms: ["Booking.com", "Airbnb"],
  stats: {
    votesCast: 32,
    notesWritten: 18,
    tripsCompleted: 9,
    groupsJoined: 4,
  },
  upcomingTrips: [
    {
      id: "trip-001",
      destination: "Lisbon, Portugal",
      accommodation: "LX Boutique Hotel",
      platform: "Booking.com",
      checkIn: "2024-09-18",
      checkOut: "2024-09-22",
      status: "Confirmed",
    },
    {
      id: "trip-002",
      destination: "Lake Como, Italy",
      accommodation: "Villa Serene",
      platform: "Airbnb",
      checkIn: "2024-11-03",
      checkOut: "2024-11-10",
      status: "Planning",
    },
  ],
  recentActivity: [
    {
      id: "activity-001",
      title: "Voted for Casa del Mar",
      description: "Preferred Casa del Mar for the Barcelona getaway.",
      timestamp: "2024-08-02T09:42:00Z",
      icon: "i-mdi-thumb-up",
      context: "Barcelona Winter Retreat",
    },
    {
      id: "activity-002",
      title: "Added note to Villa Sol",
      description: "Suggested checking the cancellation policy before booking.",
      timestamp: "2024-07-28T16:25:00Z",
      icon: "i-mdi-note-text",
      context: "Summer Family Trip",
    },
    {
      id: "activity-003",
      title: "Shared a new property",
      description: "Shared Boutique Loft with the planning group.",
      timestamp: "2024-07-20T11:05:00Z",
      icon: "i-mdi-share-variant",
      context: "Friends Reunion 2025",
    },
  ],
  savedSearches: [
    {
      id: "search-001",
      title: "Barcelona Villas - December",
      filters: ["Entire place", "4+ bedrooms", "9+ rating"],
    },
    {
      id: "search-002",
      title: "Lisbon Boutique Hotels",
      filters: ["Breakfast included", "Flexible cancellation"],
    },
    {
      id: "search-003",
      title: "Mountain Cabins",
      filters: ["Hot tub", "Fireplace", "Sleeps 8"],
    },
  ],
  communicationPreferences: [
    {
      id: "pref-001",
      label: "Booking updates",
      value: "Email & Push Notifications",
      icon: "i-mdi-email"
    },
    {
      id: "pref-002",
      label: "Group reminders",
      value: "Push Notifications",
      icon: "i-mdi-bell"
    },
    {
      id: "pref-003",
      label: "Monthly digest",
      value: "Email",
      icon: "i-mdi-calendar"
    },
  ],
};
