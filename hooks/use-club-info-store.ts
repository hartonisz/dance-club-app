import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClubInfo, Contact, Location, Partner } from '@/types';

interface ClubInfoState {
  clubInfo: ClubInfo | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchClubInfo: () => Promise<void>;
  updateClubInfo: (data: Partial<ClubInfo>) => Promise<void>;
  
  // Contact actions
  addContact: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // Location actions
  addLocation: (location: Omit<Location, 'id'>) => Promise<Location>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  
  // Partner actions
  addPartner: (partner: Omit<Partner, 'id'>) => Promise<Partner>;
  updatePartner: (id: string, data: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
}

export const useClubInfoStore = create<ClubInfoState>()(
  persist(
    (set, get) => ({
      clubInfo: null,
      isLoading: false,
      error: null,
      
      fetchClubInfo: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock club info data
          const mockClubInfo: ClubInfo = {
            name: 'RAPID BUDAPEST SE',
            description: 'RAPID BUDAPEST SE is one of Hungary\'s premier dance sports clubs, dedicated to excellence in competitive dancing. Founded in 2005, we have grown to become a leading institution in the Hungarian dance community, with numerous national and international champions among our members.',
            foundedYear: 2005,
            mission: 'Our mission is to promote dance sports in Hungary, develop world-class dancers, and create a supportive community for dancers of all ages and skill levels.',
            contacts: [
              {
                id: '1',
                name: 'Kovács István',
                role: 'Head Coach & Club President',
                email: 'istvan.kovacs@rapid.hu',
                phone: '+36 20 123 4567',
                bio: 'Former national champion with over 20 years of coaching experience. Specializes in Latin dances.',
                imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
              },
              {
                id: '2',
                name: 'Nagy Éva',
                role: 'Standard Dance Coach',
                email: 'eva.nagy@rapid.hu',
                phone: '+36 30 987 6543',
                bio: 'International judge and former European finalist. Coaching at RAPID since 2008.',
                imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
              },
              {
                id: '3',
                name: 'Szabó János',
                role: 'Youth Program Director',
                email: 'janos.szabo@rapid.hu',
                phone: '+36 70 456 7890',
                bio: 'Specializes in working with young dancers and developing new talent.',
                imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
              },
              {
                id: '4',
                name: 'Tóth Katalin',
                role: 'Club Secretary',
                email: 'office@rapid.hu',
                phone: '+36 1 234 5678',
                bio: 'Handles administrative matters, registrations, and event coordination.',
                imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
              },
            ],
            locations: [
              {
                id: '1',
                name: 'RAPID Main Studio',
                address: 'Váci utca 45',
                city: 'Budapest',
                description: 'Our main training facility with 3 professional dance floors, changing rooms, and a reception area.',
                imageUrl: 'https://images.unsplash.com/photo-1578763397601-ad8a0e8abf13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                coordinates: {
                  latitude: 47.4979,
                  longitude: 19.0402,
                },
              },
              {
                id: '2',
                name: 'RAPID Youth Center',
                address: 'Andrássy út 112',
                city: 'Budapest',
                description: 'Dedicated facility for our youth programs and beginner classes.',
                imageUrl: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                coordinates: {
                  latitude: 47.5109,
                  longitude: 19.0771,
                },
              },
            ],
            partners: [
              {
                id: '1',
                name: 'Hungarian Dance Sport Federation',
                description: 'The national governing body for dance sports in Hungary.',
                website: 'https://www.mtasz.hu',
                logoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                type: 'partner',
              },
              {
                id: '2',
                name: 'DanceSport Apparel',
                description: 'Premium dance costumes and shoes for competitive dancers.',
                website: 'https://www.dancesportapparel.com',
                logoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                type: 'sponsor',
              },
              {
                id: '3',
                name: 'Budapest Sports Foundation',
                description: 'Supporting youth sports development in Budapest.',
                website: 'https://www.bsf.hu',
                logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                type: 'sponsor',
              },
            ],
            socialMedia: {
              facebook: 'https://www.facebook.com/rapidbudapest',
              instagram: 'https://www.instagram.com/rapid_budapest',
              youtube: 'https://www.youtube.com/rapidbudapestse',
            },
          };
          
          set({ clubInfo: mockClubInfo, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch club info', 
            isLoading: false 
          });
        }
      },
      
      updateClubInfo: async (data: Partial<ClubInfo>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const updatedInfo = { ...currentInfo, ...data };
          set({ clubInfo: updatedInfo, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update club info', 
            isLoading: false 
          });
        }
      },
      
      addContact: async (contactData: Omit<Contact, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const newContact: Contact = {
            ...contactData,
            id: Math.random().toString(36).substring(2, 9),
          };
          
          const updatedContacts = [...currentInfo.contacts, newContact];
          set({ 
            clubInfo: { ...currentInfo, contacts: updatedContacts },
            isLoading: false,
          });
          
          return newContact;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add contact', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateContact: async (id: string, data: Partial<Contact>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const updatedContacts = currentInfo.contacts.map(contact => 
            contact.id === id ? { ...contact, ...data } : contact
          );
          
          set({ 
            clubInfo: { ...currentInfo, contacts: updatedContacts },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update contact', 
            isLoading: false 
          });
        }
      },
      
      deleteContact: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const updatedContacts = currentInfo.contacts.filter(contact => contact.id !== id);
          
          set({ 
            clubInfo: { ...currentInfo, contacts: updatedContacts },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete contact', 
            isLoading: false 
          });
        }
      },
      
      addLocation: async (locationData: Omit<Location, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const newLocation: Location = {
            ...locationData,
            id: Math.random().toString(36).substring(2, 9),
          };
          
          const updatedLocations = [...currentInfo.locations, newLocation];
          set({ 
            clubInfo: { ...currentInfo, locations: updatedLocations },
            isLoading: false,
          });
          
          return newLocation;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add location', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateLocation: async (id: string, data: Partial<Location>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const updatedLocations = currentInfo.locations.map(location => 
            location.id === id ? { ...location, ...data } : location
          );
          
          set({ 
            clubInfo: { ...currentInfo, locations: updatedLocations },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update location', 
            isLoading: false 
          });
        }
      },
      
      deleteLocation: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const updatedLocations = currentInfo.locations.filter(location => location.id !== id);
          
          set({ 
            clubInfo: { ...currentInfo, locations: updatedLocations },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete location', 
            isLoading: false 
          });
        }
      },
      
      addPartner: async (partnerData: Omit<Partner, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const newPartner: Partner = {
            ...partnerData,
            id: Math.random().toString(36).substring(2, 9),
          };
          
          const updatedPartners = [...currentInfo.partners, newPartner];
          set({ 
            clubInfo: { ...currentInfo, partners: updatedPartners },
            isLoading: false,
          });
          
          return newPartner;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add partner', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updatePartner: async (id: string, data: Partial<Partner>) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const updatedPartners = currentInfo.partners.map(partner => 
            partner.id === id ? { ...partner, ...data } : partner
          );
          
          set({ 
            clubInfo: { ...currentInfo, partners: updatedPartners },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update partner', 
            isLoading: false 
          });
        }
      },
      
      deletePartner: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentInfo = get().clubInfo;
          if (!currentInfo) {
            throw new Error('Club info not found');
          }
          
          const updatedPartners = currentInfo.partners.filter(partner => partner.id !== id);
          
          set({ 
            clubInfo: { ...currentInfo, partners: updatedPartners },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete partner', 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'rapid-budapest-club-info-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        clubInfo: state.clubInfo,
      }),
    }
  )
);