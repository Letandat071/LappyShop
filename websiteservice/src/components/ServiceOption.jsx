import React from 'react';

const ServiceOption = ({ title, prices, selectedOption, onOptionSelect }) => {
  const options = ['fast', 'slow', 'extra'];

  return (
    <tr>
      <td className="p-3">{title}</td>
      {options.map((option, index) => (
        <td key={option} className="p-3 text-center">
          <button
            onClick={() => onOptionSelect(option)}
            className={`px-4 py-2 rounded ${
              selectedOption === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {prices[index]}K
          </button>
        </td>
      ))}
    </tr>
  );
};

export default ServiceOption;