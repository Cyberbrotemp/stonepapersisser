import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from './store';
import Auth from './components/Auth';
import Game from './components/Game';

function App() {
  const { currentUser } = useStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" />
      {currentUser ? <Game /> : <Auth />}
    </div>
  );
}

export default App;