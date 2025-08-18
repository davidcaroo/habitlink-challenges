import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';
import CreateChallenge from './components/CreateChallenge';
import ChallengeView from './components/ChallengeView';
import Dashboard from './components/Dashboard';
import MyChallenges from './components/MyChallenges';
import PublicChallenges from './components/PublicChallenges';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import MobileMenuButton from './components/MobileMenuButton';
import AuthModal from './components/AuthModal';
import ShareChallengeModal from './components/ShareChallengeModal';
import AnimatedBackground from './components/AnimatedBackground';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { useChallenges } from './hooks/useChallenges';

type CurrentView = 'landing' | 'create' | 'challenge' | 'dashboard' | 'my-challenges' | 'public-challenges' | 'profile' | 'settings';

function AppContent() {
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, signOut } = useAuthContext();
  const { challenges, createChallenge, updateChallenge } = useChallenges();

  // Detectar cuando el usuario se loguea y cambiar automáticamente al dashboard
  useEffect(() => {
    if (user && currentView === 'landing') {
      setCurrentView('dashboard');
      setShowAuthModal(false);
    }
  }, [user, currentView]);

  const handleLogin = () => setShowAuthModal(true);
  const handleLogout = async () => {
    await signOut();
    setCurrentView('landing');
    setIsMobileSidebarOpen(false);
  };
  const handleCreateChallenge = () => setCurrentView('create');
  const handleViewChallenge = (challengeId: string) => {
    const challenge = challenges.find((c: any) => c.id === challengeId);
    if (challenge) {
      setCurrentChallenge(challenge);
      setCurrentView('challenge');
    }
  };
  const handleBackToLanding = () => {
    setCurrentView(user ? 'dashboard' : 'landing');
    setCurrentChallenge(null);
  };
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  const handleChallengeCreate = async (challengeData: {
    name: string;
    duration: number;
    type: 'individual' | 'grupal';
    emoji: string;
  }) => {
    try {
      const newChallenge = {
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        name: challengeData.name,
        duration: challengeData.duration,
        type: challengeData.type,
        emoji: challengeData.emoji,
        participants: challengeData.type === 'individual' ? 1 : Math.floor(Math.random() * 20) + 1,
        progress: [],
        createdAt: new Date().toISOString(),
      };

      const createdChallenge = await createChallenge(newChallenge);
      setCurrentChallenge(createdChallenge);

      // Si es un reto grupal, mostrar modal de compartir
      if (challengeData.type === 'grupal' && createdChallenge.shareCode) {
        setShowShareModal(true);
      } else {
        setCurrentView('challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };
  const handleUpdateProgress = async (challengeId: string, progress: boolean[]) => {
    await updateChallenge(challengeId, { progress });
    if (currentChallenge && currentChallenge.id === challengeId) {
      setCurrentChallenge((prev: any) => prev ? { ...prev, progress } : prev);
    }
  };

  const handleShareModalClose = () => {
    setShowShareModal(false);
    setCurrentView('challenge');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as CurrentView);
    setCurrentChallenge(null);
    setIsMobileSidebarOpen(false); // Cerrar sidebar en mobile al navegar
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Landing Page - No sidebar */}
      {currentView === 'landing' && (
        <Landing
          onCreateChallenge={handleCreateChallenge}
          onViewChallenge={handleViewChallenge}
          onLogin={handleLogin}
        />
      )}

      {/* Authenticated Views - With sidebar */}
      {user && currentView !== 'landing' && (
        <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
          <AnimatedBackground />

          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={toggleMobileSidebar} />

          {/* Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            isMobileOpen={isMobileSidebarOpen}
            onMobileToggle={toggleMobileSidebar}
          />

          {/* Main Content */}
          <main className="flex-1 lg:ml-0 relative z-10 overflow-y-auto">
            {currentView === 'dashboard' && (
              <Dashboard
                user={{ name: user.email?.split('@')[0] || 'Usuario', email: user.email || '' }}
                challenges={challenges}
                onCreateChallenge={handleCreateChallenge}
                onViewChallenge={handleViewChallenge}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'my-challenges' && (
              <MyChallenges
                onCreateChallenge={handleCreateChallenge}
                onViewChallenge={handleViewChallenge}
              />
            )}

            {currentView === 'public-challenges' && <PublicChallenges />}

            {currentView === 'profile' && <Profile />}

            {currentView === 'settings' && <Settings />}

            {currentView === 'create' && (
              <CreateChallenge
                onBack={() => handleNavigate('dashboard')}
                onCreate={handleChallengeCreate}
              />
            )}

            {currentView === 'challenge' && currentChallenge && (
              <ChallengeView
                challenge={currentChallenge}
                onBack={() => handleNavigate('dashboard')}
                onUpdateProgress={handleUpdateProgress}
              />
            )}
          </main>
        </div>
      )}

      {/* Share Challenge Modal */}
      {currentChallenge && (
        <ShareChallengeModal
          challenge={currentChallenge}
          isOpen={showShareModal}
          onClose={handleShareModalClose}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;