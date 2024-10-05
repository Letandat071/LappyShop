import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDarkMode } from '../contexts/DarkModeContext';

const MapService = () => {
  const { isDarkMode } = useDarkMode();
  const [episodes, setEpisodes] = useState([]);

  const [selectedEpisodes, setSelectedEpisodes] = useState([]);
  const [selectedStages, setSelectedStages] = useState({});
  const [expandedEpisodes, setExpandedEpisodes] = useState([]);

  useEffect(() => {
    fetch('/listEvent.txt')
      .then(response => response.text())
      .then(text => {
        const parsedEpisodes = parseEpisodes(text);
        setEpisodes(parsedEpisodes);
      })
      .catch(error => console.error('Lỗi khi tải danh sách episode:', error));
  }, []);

  const parseEpisodes = (text) => {
    // Hàm phân tích nội dung file listEvent.txt
    const lines = text.split('\n');
    const episodes = [];
    let currentEpisode = null;

    lines.forEach(line => {
      if (line.startsWith('Episode') || line.startsWith('Prologue')) {
        if (currentEpisode) {
          episodes.push(currentEpisode);
        }
        currentEpisode = { title: line.trim(), stages: [] };
      } else if (line.trim() !== '') {
        currentEpisode.stages.push(line.trim());
      }
    });

    if (currentEpisode) {
      episodes.push(currentEpisode);
    }

    return episodes;
  };

  const toggleEpisodeSelection = (index) => {
    setSelectedEpisodes(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleStageSelection = (episodeIndex, stageIndex) => {
    setSelectedStages(prev => ({
      ...prev,
      [episodeIndex]: prev[episodeIndex]
        ? prev[episodeIndex].includes(stageIndex)
          ? prev[episodeIndex].filter(i => i !== stageIndex)
          : [...prev[episodeIndex], stageIndex]
        : [stageIndex]
    }));
  };

  const toggleEpisodeExpansion = (index) => {
    setExpandedEpisodes(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-800'} mb-6`}>BẢN ĐỒ</h2>
      

      <div className="space-y-4 h-[600px] overflow-y-auto pr-4 custom-scrollbar">
        {episodes.map((episode, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden shadow-md`}
          >
            <div className="flex items-center p-4">

              <div className="w-20 h-20 flex-shrink-0 mr-4">
                <img 
                  src={`map/${index}.png`} 
                  alt={episode.title} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{episode.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleEpisodeSelection(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedEpisodes.includes(index)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {selectedEpisodes.includes(index) ? 'Đã chọn' : 'Chọn Chapter'}
                  </button>
                  <button
                    onClick={() => toggleEpisodeExpansion(index)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                  >
                    {expandedEpisodes.includes(index) ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {expandedEpisodes.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4`}
                >
                  <h4 className="text-gray-700 font-medium mb-2">Các màn chơi:</h4>

                  <div className="flex flex-wrap gap-2">
                    {episode.stages.map((stage, stageIndex) => (
                      <motion.button
                        key={stageIndex}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleStageSelection(index, stageIndex)}
                        className={`text-xs px-3 py-1 rounded-full transition-colors duration-200 ${
                          selectedStages[index]?.includes(stageIndex)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {stage}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-gray-800 p-4 rounded-lg shadow-md"
      >
        <h3 className="text-xl font-bold text-white mb-2">Đăng ký</h3>
        <p className="text-white mb-4">
          Chapters đã chọn: {selectedEpisodes.length}<br />
          Màn chơi đã chọn: {Object.values(selectedStages).flat().length}
        </p>
        <button className="bg-white text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200">
          Xác nhận đăng ký
        </button>
      </motion.div>
    </div>
  );
};

export default MapService;