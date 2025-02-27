import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import {NavBar}  from './modules/navbar';
import {Footer}  from './modules/footer';
import { Home } from './pages/home';
import { Chat } from './pages/chat';
import { Page404 } from './pages/404page';
import { UserProvider } from './Context/UserProvider';
function App() {
  const location = useLocation();

  return (
    <div className="App">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
      {location.pathname !== "/chat" && <Footer />}
    </div>
  );
}

function AppWrapper() {
  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}

export default AppWrapper;
