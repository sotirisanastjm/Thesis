import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { NavBar } from './modules/navbar';
import { Footer } from './modules/footer';
import { Home } from './pages/home';
import { Chat } from './pages/chat';
import { Page404 } from './pages/404page';
import { UserProvider } from './Context/UserProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Notepad } from './modules/Notepad';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notepad" element={<Notepad />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
      {location.pathname !== "/chat" && <Footer />}
    </div>
  );
}

function AppWrapper() {

  const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl('localnet') },
    mainnet: { url: getFullnodeUrl('devnet') },
  });
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
        <WalletProvider>
          <UserProvider>
            <Router>
              <App />
            </Router>
          </UserProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default AppWrapper;
