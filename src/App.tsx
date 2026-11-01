import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSettings } from './data/repos';
import { CoursePage } from './features/courses/CoursePage';
import { CoursesPage } from './features/courses/CoursesPage';
import { ExamsPage } from './features/exams/ExamsPage';
import { MorePage } from './features/more/MorePage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { WeekPage } from './features/schedule/WeekPage';
import { TodayPage } from './features/today/TodayPage';
import { BottomNav } from './ui/BottomNav';
import { UpdatePrompt } from './ui/UpdatePrompt';

export function App() {
  const settings = useSettings();
  if (!settings) return null; // loading from IndexedDB
  // UpdatePrompt also registers the offline service worker, so it renders on every screen.
  if (!settings.onboarded) {
    return (
      <>
        <OnboardingPage />
        <UpdatePrompt />
      </>
    );
  }

  // HashRouter: works on any static host without server-side routing.
  return (
    <HashRouter>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/week" element={<WeekPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CoursePage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <UpdatePrompt />
        <BottomNav />
      </div>
    </HashRouter>
  );
}
