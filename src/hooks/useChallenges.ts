import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';

export interface Challenge {
  id: string;
  name: string;
  duration: number;
  type: 'individual' | 'grupal';
  emoji: string;
  participants: number;
  progress: boolean[];
  createdAt: string;
  isPublic?: boolean;
  shareCode?: string;
  createdBy?: string;
  participantIds?: string[];
}

const LOCAL_KEY = 'habitlink_challenges';

function getLocalChallenges(): Challenge[] {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? JSON.parse(data) : [];
}

function setLocalChallenges(challenges: Challenge[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(challenges));
}

export function useChallenges() {
  const { user, isAnonymous } = useAuthContext();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Load challenges from correct source
  useEffect(() => {
    setLoading(true);
    if (isAnonymous) {
      setChallenges(getLocalChallenges());
      setLoading(false);
    } else {
      supabase
        .from('challenges')
        .select('*')
        .eq('created_by', user?.id)
        .then(({ data, error }) => {
          if (error) {
            setChallenges([]);
          } else {
            // Map database response to frontend format
            const mappedChallenges = (data || []).map(dbChallenge => ({
              id: dbChallenge.id,
              name: dbChallenge.name,
              duration: dbChallenge.duration,
              type: dbChallenge.type,
              emoji: dbChallenge.emoji,
              participants: dbChallenge.participants,
              createdAt: dbChallenge.created_at,
              progress: [] // Will be loaded separately if needed
            }));
            setChallenges(mappedChallenges);
          }
          setLoading(false);
        });
    }
  }, [user, isAnonymous]);

  // Create challenge
  const createChallenge = useCallback(async (challenge: Challenge) => {
    if (isAnonymous) {
      const updated = [...getLocalChallenges(), challenge];
      setLocalChallenges(updated);
      setChallenges(updated);
      return challenge;
    } else {
      // Generate unique share code for public challenges
      const shareCode = challenge.type === 'grupal' ? 
        Math.random().toString(36).substring(2, 8).toUpperCase() : undefined;
      
      // Map frontend fields to database fields - let Supabase generate UUID
      // Start with basic fields that definitely exist
      const dbChallenge: any = {
        name: challenge.name,
        duration: challenge.duration,
        type: challenge.type,
        emoji: challenge.emoji,
        participants: challenge.participants,
        created_by: user?.id,
        is_public: challenge.type === 'grupal'
      };

      // Add share_code only if it's a grupal challenge and we have a shareCode
      if (challenge.type === 'grupal' && shareCode) {
        dbChallenge.share_code = shareCode;
      }
      
      const { data, error } = await supabase
        .from('challenges')
        .insert([dbChallenge])
        .select()
        .single();
      if (error) throw error;
      
      // Map database response back to frontend format
      const frontendChallenge = {
        id: data.id,
        name: data.name,
        duration: data.duration,
        type: data.type,
        emoji: data.emoji,
        participants: data.participants,
        createdAt: data.created_at,
        progress: [],
        isPublic: data.is_public,
        shareCode: data.share_code,
        createdBy: data.created_by,
        participantIds: []
      };
      
      setChallenges((prev) => [...prev, frontendChallenge]);
      return frontendChallenge;
    }
  }, [isAnonymous, user]);

  // Update challenge
  const updateChallenge = useCallback(async (id: string, updates: Partial<Challenge>) => {
    if (isAnonymous) {
      const updated = getLocalChallenges().map((c) => (c.id === id ? { ...c, ...updates } : c));
      setLocalChallenges(updated);
      setChallenges(updated);
      return updated.find((c) => c.id === id);
    } else {
      // Map frontend fields to database fields
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.emoji !== undefined) dbUpdates.emoji = updates.emoji;
      if (updates.participants !== undefined) dbUpdates.participants = updates.participants;
      
      const { data, error } = await supabase
        .from('challenges')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      
      // Map database response back to frontend format
      const frontendChallenge = {
        id: data.id,
        name: data.name,
        duration: data.duration,
        type: data.type,
        emoji: data.emoji,
        participants: data.participants,
        createdAt: data.created_at,
        progress: []
      };
      
      setChallenges((prev) => prev.map((c) => (c.id === id ? frontendChallenge : c)));
      return frontendChallenge;
    }
  }, [isAnonymous]);

  // Delete challenge
  const deleteChallenge = useCallback(async (id: string) => {
    if (isAnonymous) {
      const updated = getLocalChallenges().filter((c) => c.id !== id);
      setLocalChallenges(updated);
      setChallenges(updated);
      return true;
    } else {
      const { error } = await supabase.from('challenges').delete().eq('id', id);
      if (error) throw error;
      setChallenges((prev) => prev.filter((c) => c.id !== id));
      return true;
    }
  }, [isAnonymous]);

  // Migrate localStorage to Supabase
  const migrateToSupabase = useCallback(async () => {
    if (!isAnonymous && user) {
      const local = getLocalChallenges();
      if (local.length === 0) return;
      const toInsert = local.map((c) => ({ ...c, created_by: user.id }));
      const { error } = await supabase.from('challenges').insert(toInsert);
      if (error) throw error;
      setLocalChallenges([]);
      setChallenges((prev) => [...prev, ...toInsert]);
    }
  }, [isAnonymous, user]);

  // Get public challenges
  const getPublicChallenges = useCallback(async () => {
    if (isAnonymous) return [];
    
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        *,
        profiles:created_by(id, email)
      `)
      .eq('is_public', true)
      .eq('type', 'grupal')
      .neq('created_by', user?.id); // Exclude own challenges
    
    if (error) throw error;
    
    return (data || []).map(dbChallenge => ({
      id: dbChallenge.id,
      name: dbChallenge.name,
      duration: dbChallenge.duration,
      type: dbChallenge.type,
      emoji: dbChallenge.emoji,
      participants: dbChallenge.participants,
      createdAt: dbChallenge.created_at,
      progress: [],
      isPublic: dbChallenge.is_public,
      shareCode: dbChallenge.share_code,
      createdBy: dbChallenge.created_by,
      participantIds: []
    }));
  }, [isAnonymous, user?.id]);

  // Join public challenge by share code
  const joinChallengeByCode = useCallback(async (shareCode: string) => {
    if (isAnonymous) throw new Error('Debes estar logueado para unirte a retos públicos');
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('share_code', shareCode.toUpperCase())
      .eq('is_public', true)
      .single();
    
    if (error || !data) throw new Error('Código de reto no válido');
    
    // Check if user is already participating
    const { data: existingParticipation } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('challenge_id', data.id)
      .eq('user_id', user?.id)
      .single();
    
    if (existingParticipation) throw new Error('Ya estás participando en este reto');
    
    // Add user to challenge participants
    const { error: participationError } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: data.id,
        user_id: user?.id,
        joined_at: new Date().toISOString()
      });
    
    if (participationError) throw participationError;
    
    return {
      id: data.id,
      name: data.name,
      duration: data.duration,
      type: data.type,
      emoji: data.emoji,
      participants: data.participants,
      createdAt: data.created_at,
      progress: [],
      isPublic: data.is_public,
      shareCode: data.share_code,
      createdBy: data.created_by,
      participantIds: []
    };
  }, [isAnonymous, user?.id]);

  // Join public challenge directly
  const joinPublicChallenge = useCallback(async (challengeId: string) => {
    if (isAnonymous) throw new Error('Debes estar logueado para unirte a retos públicos');
    
    // Check if user is already participating
    const { data: existingParticipation } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('user_id', user?.id)
      .single();
    
    if (existingParticipation) throw new Error('Ya estás participando en este reto');
    
    // Add user to challenge participants
    const { error } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: challengeId,
        user_id: user?.id,
        joined_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  }, [isAnonymous, user?.id]);

  return {
    challenges,
    loading,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    migrateToSupabase,
    getPublicChallenges,
    joinChallengeByCode,
    joinPublicChallenge
  };
}
