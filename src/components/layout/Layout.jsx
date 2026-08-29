import { Outlet } from 'react-router-dom';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import BackgroundMusic from '../ui/BackgroundMusic.jsx';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />

      {/* Mounted on the layout, not on a page. React Router keeps this element
          alive across route changes, so the raga carries on uninterrupted while
          someone browses and checks out -- the in-store feeling depends on it
          not restarting at every navigation. */}
      <BackgroundMusic src="/raga.mp3" />
    </>
  );
}
