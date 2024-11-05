import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {NavBar}  from './modules/navbar';
import {Footer}  from './modules/footer';
import { Home } from './pages/home';
import { Chat } from './pages/chat';
import { Page404 } from './pages/404page';
function App() {

    return (
      <div className="App">
        <Router>
          <NavBar />
          <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    );
}

export default App;
