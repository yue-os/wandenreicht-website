import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import GlobalCanvas from './components/GlobalCanvas';
import CustomCursor from './components/CustomCursor';
import GlobalNav from './components/GlobalNav';
import { SceneProvider } from './lib/SceneContext';
import Home from './pages/Home';
import MemberProfile from './pages/MemberProfile';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const navigate = useNavigate();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#060608' }}>
        <div className="w-8 h-8 border-4 border-slate-700 border-t-slate-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <SceneProvider navigate={navigate}>
      <GlobalCanvas />
      <CustomCursor />
      <GlobalNav />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/member/:id" element={<MemberProfile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </SceneProvider>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App