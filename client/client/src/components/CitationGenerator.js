import React, { useState } from 'react';

const CitationGenerator = ({ paper }) => {
  const [copyStatus, setCopyStatus] = useState('');
  const [citationStyle, setCitationStyle] = useState('apa');

  // Generate citations based on the style
  const generateCitation = (style) => {
    const authors = paper.authors || ['Unknown Author'];
    const title = paper.title || 'Untitled';
    const journal = paper.journal || 'Unknown Journal';
    const year = paper.year || 'n.d.';
    const url = paper.url || '#';

    switch (style) {
      case 'apa':
        return `${authors.join(', ')}. (${year}). ${title}. ${journal}. ${url ? `Retrieved from ${url}` : ''}`;
        
      case 'mla':
        return `${authors.join(', ')}. "${title}." ${journal}, ${year}. ${url ? `Web. ${new Date().toLocaleDateString()}.` : ''}`;
        
      case 'chicago':
        return `${authors.join(', ')}. "${title}." ${journal} (${year}). ${url ? `${url}.` : ''}`;
        
      case 'harvard':
        return `${authors.join(', ')} (${year}). ${title}. ${journal}. ${url ? `Available at: ${url}` : ''}`;
        
      case 'bibtex':
        const authorLastNames = authors.map(author => {
          const parts = author.split(',');
          return parts.length > 1 ? parts[0].trim() : author.split(' ').pop().trim();
        });
        
        const firstAuthorKey = authorLastNames[0]?.toLowerCase() || 'unknown';
        const bibtexKey = `${firstAuthorKey}${year}${title.split(' ')[0].toLowerCase()}`;
        
        return `@article{${bibtexKey},
  author = {${authors.join(' and ')}},
  title = {${title}},
  journal = {${journal}},
  year = {${year}},
  url = {${url}}
}`;
      
      default:
        return `${authors.join(', ')}. (${year}). ${title}. ${journal}.`;
    }
  };

  const handleCopyCitation = () => {
    const citation = generateCitation(citationStyle);
    navigator.clipboard.writeText(citation)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        setCopyStatus('Failed to copy');
      });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Citation Generator</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Citation Style</label>
        <select
          value={citationStyle}
          onChange={(e) => setCitationStyle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="apa">APA (7th edition)</option>
          <option value="mla">MLA (8th edition)</option>
          <option value="chicago">Chicago (17th edition)</option>
          <option value="harvard">Harvard</option>
          <option value="bibtex">BibTeX</option>
        </select>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
        <pre className={`text-gray-700 whitespace-pre-wrap ${citationStyle === 'bibtex' ? 'font-mono text-sm' : ''}`}>
          {generateCitation(citationStyle)}
        </pre>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleCopyCitation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          {copyStatus || 'Copy Citation'}
          {copyStatus === 'Copied!' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default CitationGenerator;
