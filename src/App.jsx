import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { IssStats } from './components/iss/IssStats';
import { IssMap } from './components/iss/IssMap';
import { Astronauts } from './components/iss/Astronauts';
import { NewsSection } from './components/news/NewsSection';
import { IssSpeedChart } from './components/charts/IssSpeedChart';
import { NewsChart } from './components/charts/NewsChart';
import { Chatbot } from './components/chatbot/Chatbot';
import { useIssTracking } from './hooks/useIssTracking';
import { useNews } from './hooks/useNews';

function Dashboard() {
  const issData = useIssTracking();
  const newsData = useNews(['technology', 'science']);

  // Build the unified context for the chatbot
  const dashboardContext = {
    position: issData.position,
    speed: issData.speed,
    place: issData.place,
    astronauts: issData.astronauts,
    articles: newsData.articles
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* ISS Top Section */}
        <section className="space-y-6">
          <IssStats 
            position={issData.position}
            speed={issData.speed}
            place={issData.place}
            lastUpdate={issData.lastUpdate}
            refreshData={issData.refreshData}
            loading={issData.loading}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IssMap position={issData.position} path={issData.path} />
            </div>
            <div className="lg:col-span-1 h-[400px] lg:h-auto">
              <Astronauts astronauts={issData.astronauts} />
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[400px]">
          <IssSpeedChart data={issData.speedHistory} />
          <NewsChart articles={newsData.articles} />
        </section>

        {/* News Section */}
        <section>
          <NewsSection />
        </section>
      </main>

      {/* Floating Chatbot */}
      <Chatbot dashboardContext={dashboardContext} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
