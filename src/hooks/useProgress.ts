import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';

interface ProgressEntry {
  id: string;
  challenge_id: string;
  user_id?: string;
  session_id?: string;
  day_number: number;
  completed: boolean;
  completed_at: string;
}

export function useProgress(challengeId: string) {
  const { user, isAnonymous } = useAuthContext();
  const [progress, setProgress] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Generate session ID for anonymous users
  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('habitlink_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('habitlink_session_id', sessionId);
    }
    return sessionId;
  }, []);

  // Load progress from correct source
  useEffect(() => {
    if (!challengeId) return;
    
    setLoading(true);
    if (isAnonymous) {
      // Load from localStorage for anonymous users
      const localKey = `progress_${challengeId}`;
      const localProgress = localStorage.getItem(localKey);
      setProgress(localProgress ? JSON.parse(localProgress) : []);
      setLoading(false);
    } else {
      // Load from Supabase for registered users
      supabase
        .from('progress_entries')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('user_id', user?.id)
        .order('day_number')
        .then(({ data, error }) => {
          if (error) {
            console.error('Error loading progress:', error);
            setProgress([]);
          } else {
            // Convert database entries to boolean array
            const progressArray: boolean[] = [];
            data?.forEach(entry => {
              progressArray[entry.day_number - 1] = entry.completed;
            });
            setProgress(progressArray);
          }
          setLoading(false);
        });
    }
  }, [challengeId, user, isAnonymous]);

  // Update progress for a specific day
  const updateProgress = useCallback(async (dayIndex: number, completed: boolean) => {
    if (!challengeId) return;
    
    const dayNumber = dayIndex + 1;
    const newProgress = [...progress];
    newProgress[dayIndex] = completed;

    if (isAnonymous) {
      // Save to localStorage for anonymous users
      const localKey = `progress_${challengeId}`;
      localStorage.setItem(localKey, JSON.stringify(newProgress));
      setProgress(newProgress);
    } else {
      // Save to Supabase for registered users
      try {
        if (completed) {
          // Insert or update progress entry
          const { error } = await supabase
            .from('progress_entries')
            .upsert({
              challenge_id: challengeId,
              user_id: user?.id,
              day_number: dayNumber,
              completed: true
            });
          if (error) throw error;
        } else {
          // Delete progress entry if uncompleted
          await supabase
            .from('progress_entries')
            .delete()
            .eq('challenge_id', challengeId)
            .eq('user_id', user?.id)
            .eq('day_number', dayNumber);
        }
        setProgress(newProgress);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  }, [challengeId, progress, user, isAnonymous]);

  // Migrate anonymous progress to Supabase
  const migrateProgressToSupabase = useCallback(async () => {
    if (!isAnonymous && user && challengeId) {
      const localKey = `progress_${challengeId}`;
      const localProgress = localStorage.getItem(localKey);
      
      if (localProgress) {
        const progressArray: boolean[] = JSON.parse(localProgress);
        const entries = progressArray.map((completed, index) => ({
          challenge_id: challengeId,
          user_id: user.id,
          day_number: index + 1,
          completed
        })).filter(entry => entry.completed); // Only migrate completed days

        if (entries.length > 0) {
          const { error } = await supabase
            .from('progress_entries')
            .insert(entries);
          
          if (!error) {
            localStorage.removeItem(localKey);
          }
        }
      }
    }
  }, [challengeId, user, isAnonymous]);

  // Calculate statistics
  const completedDays = progress.filter(Boolean).length;
  const totalDays = progress.length;
  const completionPercentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return {
    progress,
    loading,
    completedDays,
    totalDays,
    completionPercentage,
    updateProgress,
    migrateProgressToSupabase
  };
}
