import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import piggyBankLogo from '../assets/piggyBankIcon.png';
import homeGreyIcon from '../assets/homeGreyIcon.png';
import homeYellowIcon from '../assets/homeYellowIcon.png';
import giftsGreyIcon from '../assets/giftsGreyIcon.png';
import giftsYellowIcon from '../assets/giftsYellowIcon.png';


const Layout: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    // Clear session token from localStorage
    localStorage.removeItem('sessionToken');
    // Navigate to signin page
    navigate('/signin');
    setShowProfileMenu(false);
  };

  const goToSettings = () => {
    navigate('/settings');
    setShowProfileMenu(false);
  };

  return (
    <div className="flex h-screen">
      <header className="flex justify-between items-center p-4 px-8 bg-white fixed w-full z-10">
      <div className="flex items-center gap-2">
        <Link to="/home" className="flex items-center gap-2 hover:opacity-80 cursor-pointer">
          <img src={piggyBankLogo} alt="PiggyBank Logo" className="w-7" />
          <h1 className="text-xl font-semibold font-lora">PiggyBank</h1>
        </Link>
      </div>
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full bg-gray-300 cursor-pointer"
            onClick={toggleProfileMenu}
          ></div>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded border border-gray-200">
              <button
                className="block w-full text-left font-roboto text-regular px-4 py-3 hover:bg-gray-100 border-b border-gray-200"
                onClick={goToSettings}
              >
                Settings
              </button>
              <button
                className="block w-full text-left px-4 py-3 font-roboto text-regular hover:bg-gray-100"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>
      <nav className="w-1/6 bg-white fixed h-full top-[4.5rem] border-r border-gray-200">
        <ul>
          <li className={`p-4 border-b border-gray-200/50 ${
            location.pathname === '/home' ? 'border-l-4 border-l-[#F3B000]' : 'border-l-4 border-l-white'
          }`}>
            <Link
              to="/home"
              className={`font-medium font-roboto text-xs flex items-center gap-3 ${
                location.pathname === '/home' ? 'text-black' : 'text-[#B7B7B7]'
              }`}
            >
              <img 
                src={location.pathname === '/home' ? homeYellowIcon : homeGreyIcon}
                alt="Home"
                className="w-4 h-4"
              />
              Home
            </Link>
          </li>
          <li className={`p-4 border-b border-gray-200/50 ${
            location.pathname === '/gift' ? 'border-l-4 border-l-[#F3B000]' : 'border-l-4 border-l-white'
          }`}>
            <Link
              to="/gift"
              className={`font-medium font-roboto text-xs flex items-center gap-3 ${
                location.pathname === '/gift' ? 'text-black' : 'text-[#B7B7B7]'
              }`}
            >
              <img 
                src={location.pathname === '/gift' ? giftsYellowIcon : giftsGreyIcon}
                alt="Gifts"
                className="w-4 h-4"
              />
              Gifts
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex-1">
        <main className="mt-[4.5rem] p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 