import React, { useState, useEffect } from 'react';

const TagManager = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([
    'machine learning', 'artificial intelligence', 'data science', 
    'computer vision', 'natural language processing', 'neural networks',
    'healthcare', 'finance', 'education', 'security', 'sustainability'
  ]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      onChange(newTags);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  const filteredSuggestions = suggestedTags.filter(
    tag => tag.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(tag)
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[80px]">
        {tags.map((tag, index) => (
          <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={tags.length === 0 ? "Add tags... (press Enter after each tag)" : ""}
          className="flex-grow outline-none min-w-[120px] py-1"
        />
      </div>
      
      {inputValue && filteredSuggestions.length > 0 && (
        <div className="mt-1 border border-gray-200 rounded-md shadow-sm bg-white">
          <ul className="py-1">
            {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
              <li
                key={index}
                onClick={() => addTag(suggestion)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {tags.length === 0 && (
        <p className="text-xs text-gray-500 mt-1">
          Example tags: machine learning, data science, healthcare
        </p>
      )}
    </div>
  );
};

export default TagManager;
