export type UserRole = 'admin' | 'coach' | 'dancer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dateOfBirth?: string;
  partner?: string;
  category?: string;
  bio?: string;
  joinedAt: string;
  approved?: boolean;
  profileImage?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'competition' | 'workshop' | 'meeting' | 'other';
  categories?: string[];
  reminderEnabled?: boolean;
  createdBy?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  category: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  videoId?: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  exercises: Exercise[];
  assignedTo?: string[];
  createdBy: string;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  description: string;
  achievements: string[];
  coachFeedback?: string;
  coachId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event' | 'training' | 'video' | 'system';
  relatedId?: string;
  createdAt: string;
  read: boolean;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  imageUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Partner {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  type: 'sponsor' | 'partner';
}

export interface ClubInfo {
  name: string;
  description: string;
  foundedYear: number;
  mission: string;
  contacts: Contact[];
  locations: Location[];
  partners: Partner[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface UserRegistration extends Omit<User, 'id' | 'joinedAt' | 'approved'> {
  password: string;
}