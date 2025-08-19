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
    if (isAnonymous) {
      console.log('User is anonymous, returning empty array');
      return [];
    }
    
    console.log('Fetching public challenges for user:', user?.id);
    
    // First, let's test basic connectivity
    const { data: testData, error: testError } = await supabase
      .from('challenges')
      .select('count', { count: 'exact' });
    
    console.log('Total challenges count test:', { testData, testError });
    
    // Now try to get all public challenges without user filter first
    const { data: allPublic, error: allError } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_public', true)
      .eq('type', 'grupal');
      
    console.log('All public challenges:', { allPublic, allError });
    
    // Now try with user filter
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_public', true)
      .eq('type', 'grupal')
      .neq('created_by', user?.id); // Exclude own challenges
    
    console.log('Public challenges query result:', { data, error, userId: user?.id });
    
    if (error) {
      console.error('Error fetching public challenges:', error);
      throw error;
    }
    
    const mappedChallenges = (data || []).map(dbChallenge => ({
      id: dbChallenge.id,
      name: dbChallenge.name,
      duration: dbChallenge.duration,
      type: dbChallenge.type,
      emoji: dbChallenge.emoji,
      participants: dbChallenge.participants || 1,
      createdAt: dbChallenge.created_at,
      progress: [],
      isPublic: dbChallenge.is_public,
      shareCode: dbChallenge.share_code,
      createdBy: dbChallenge.created_by,
      participantIds: []
    }));
    
    console.log('Mapped public challenges:', mappedChallenges);
    return mappedChallenges;
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
    
    console.log('Attempting to join challenge:', challengeId, 'with user:', user?.id);
    
    // Check if user is already participating
    const { data: existingParticipation, error: checkError } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('user_id', user?.id)
      .single();
    
    console.log('Existing participation check:', { existingParticipation, checkError });
    
    if (existingParticipation) throw new Error('Ya estás participando en este reto');
    
    // Add user to challenge participants
    const { error } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: challengeId,
        user_id: user?.id,
        joined_at: new Date().toISOString()
      });
    
    console.log('Join challenge result:', { error });
    
    if (error) throw error;
    return true;
  }, [isAnonymous, user?.id]);

  // Get challenges where user participates (joined challenges)
  const getJoinedChallenges = useCallback(async () => {
    if (isAnonymous) return [];
    
    try {
      const { data, error } = await supabase
        .from('challenge_participants')
        .select(`
          challenge_id,
          joined_at,
          challenges!inner(*)
        `)
        .eq('user_id', user?.id);
      
      if (error) {
        console.error('Error fetching joined challenges:', error);
        throw error;
      }
      
      return (data || []).map(participation => ({
        id: participation.challenges.id,
        name: participation.challenges.name,
        duration: participation.challenges.duration,
        type: participation.challenges.type,
        emoji: participation.challenges.emoji,
        participants: participation.challenges.participants,
        createdAt: participation.challenges.created_at,
        progress: [],
        isPublic: participation.challenges.is_public,
        shareCode: participation.challenges.share_code,
        createdBy: participation.challenges.created_by,
        participantIds: [],
        joinedAt: participation.joined_at
      }));
    } catch (error: any) {
      console.error('Unexpected error in getJoinedChallenges:', error);
      throw error;
    }
  }, [isAnonymous, user?.id]);

  // Get challenge progress for joined challenges
  const getChallengeProgress = useCallback(async (challengeId: string) => {
    if (isAnonymous) return { userProgress: [], allProgress: [] };
    
    try {
      // Get user's progress
      const { data: userProgress, error: userError } = await supabase
        .from('progress_entries')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('user_id', user?.id)
        .order('day_number');
      
      if (userError) {
        console.error('Error fetching user progress:', userError);
        // Don't throw, just return empty progress
        return { userProgress: [], allProgress: [] };
      }
      
      // Get all participants' progress for comparison
      const { data: allProgress, error: allError } = await supabase
        .from('progress_entries')
        .select(`
          *,
          challenge_participants!inner(user_id)
        `)
        .eq('challenge_id', challengeId)
        .order('day_number');
      
      if (allError) {
        console.error('Error fetching all progress:', allError);
        // Return user progress but empty all progress
        return { userProgress: userProgress || [], allProgress: [] };
      }
      
      return {
        userProgress: userProgress || [],
        allProgress: allProgress || []
      };
    } catch (error: any) {
      console.error('Unexpected error in getChallengeProgress:', error);
      return { userProgress: [], allProgress: [] };
    }
  }, [isAnonymous, user?.id]);

  // Mark progress for a joined challenge
  const markChallengeProgress = useCallback(async (challengeId: string, dayNumber: number, completed: boolean) => {
    if (isAnonymous) throw new Error('Debes estar logueado para marcar progreso');
    
    const { data, error } = await supabase
      .from('progress_entries')
      .upsert({
        challenge_id: challengeId,
        user_id: user?.id,
        day_number: dayNumber,
        completed,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'challenge_id,user_id,day_number'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    joinPublicChallenge,
    getJoinedChallenges,
    getChallengeProgress,
    markChallengeProgress
  };
}
