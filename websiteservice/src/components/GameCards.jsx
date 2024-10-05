import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';

const GameCard = ({ title, imageSrc, onSelect, isActive }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <motion.div 
      className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md overflow-hidden cursor-pointer ${isActive ? 'ring-2 ring-blue-500' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(title)}
    >
      <img 
        src={imageSrc} 
        alt={title} 
        className={`w-full h-40 object-cover transition-all duration-300 ${isActive ? '' : 'grayscale'}`} 
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </motion.div>
  );
};

const GameCards = ({ onSelectGame, selectedGame }) => {
  const games = [
    { title: 'The Sand', imageSrc: '/asset/TheSand.jpg' },
    { title: 'IS', imageSrc: '/asset/IS.jpg' },
    { title: 'Map', imageSrc: '/asset/Map-Event.png' },
    { title: 'Event', imageSrc: '/asset/Map.jpg' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {games.map((game) => (
        <GameCard 
          key={game.title} 
          {...game} 
          onSelect={onSelectGame}
          isActive={selectedGame === game.title}
        />
      ))}
    </div>
  );
};

export default GameCards;