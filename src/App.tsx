import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

// Judge
import JudgeLogin from './pages/Judge/Login';
import JudgeDashboard from './pages/Judge/Dashboard';
import JudgeTeamDetails from './pages/Judge/TeamDetails';

// Audience
import AudienceLogin from './pages/Audience/Login';
import AudienceDashboard from './pages/Audience/Dashboard';
import AudienceTeamDetails from './pages/Audience/TeamDetails';

// Quiz
import QuizLogin from './pages/Quiz/Login';
import QuizTake from './pages/Quiz/Take';

// Admin
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import RaceLive from './pages/Admin/RaceLive';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          
          {/* Judge Routes */}
          <Route path="/judge" element={<PageTransition><JudgeLogin /></PageTransition>} />
          <Route path="/judge/dashboard" element={<PageTransition><JudgeDashboard /></PageTransition>} />
          <Route path="/judge/team/:id" element={<PageTransition><JudgeTeamDetails /></PageTransition>} />
          
          {/* Audience Routes */}
          <Route path="/audience" element={<PageTransition><AudienceLogin /></PageTransition>} />
          <Route path="/audience/teams" element={<PageTransition><AudienceDashboard /></PageTransition>} />
          <Route path="/audience/team/:id" element={<PageTransition><AudienceTeamDetails /></PageTransition>} />
          
          {/* Quiz Routes */}
          <Route path="/quiz" element={<PageTransition><QuizLogin /></PageTransition>} />
          <Route path="/quiz/take" element={<PageTransition><QuizTake /></PageTransition>} />
          
          {/* Admin Routes */}
          <Route path="/hello-kitty" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/hello-kitty/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="/hello-kitty/race" element={<RaceLive />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
