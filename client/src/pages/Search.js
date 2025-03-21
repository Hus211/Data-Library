import React, { useState } from 'react';

const Search = () => {
  // Sample dataset mimicking academic papers
  const sampleData = [
    {
      id: 1,
      title: "Machine Learning Applications in Financial Markets",
      authors: ["Johnson, A.", "Williams, R.", "Chen, L."],
      journal: "Journal of Financial Technology",
      year: 2023,
      abstract: "This paper explores recent advancements in machine learning algorithms for predicting market trends and optimizing investment portfolios.",
      citations: 87,
      keywords: ["machine learning", "finance", "market prediction", "portfolio optimization"],
      url: "#"
    },
    {
      id: 2,
      title: "Data Privacy Challenges in Healthcare Systems",
      authors: ["Martinez, S.", "Brown, K."],
      journal: "Medical Informatics Review",
      year: 2022,
      abstract: "An analysis of privacy preservation techniques for sensitive medical data, considering both regulatory compliance and practical implementations.",
      citations: 124,
      keywords: ["healthcare", "data privacy", "HIPAA", "medical records"],
      url: "#"
    },
    {
      id: 3,
      title: "Sustainable Supply Chain Management: A Systematic Review",
      authors: ["Garcia, P.", "Smith, T.", "Kumar, A."],
      journal: "Journal of Operations Management",
      year: 2023,
      abstract: "This systematic review examines sustainability practices across global supply chains, identifying key trends and future research directions.",
      citations: 56,
      keywords: ["supply chain", "sustainability", "operations management", "systematic review"],
      url: "#"
    },
    {
      id: 4,
      title: "Artificial Intelligence in Legal Document Processing",
      authors: ["Thompson, J.", "Anderson, M."],
      journal: "Legal Technology Journal",
      year: 2022,
      abstract: "Examines how AI-powered tools are transforming legal document review, contract analysis, and case research in law firms.",
      citations: 43,
      keywords: ["artificial intelligence", "legal tech", "document processing", "contract analysis"],
      url: "#"
    },
    {
      id: 5,
      title: "Digital Transformation Strategies for Small and Medium Enterprises",
      authors: ["Patel, R.", "Wilson, E."],
      journal: "Business Technology Quarterly",
      year: 2023,
      abstract: "This paper provides a framework for SMEs to implement digital transformation strategies while minimizing disruption to core operations.",
      citations: 92,
      keywords: ["digital transformation", "SME", "business strategy", "technology adoption"],
      url: "#"
    },
    {
      id: 6,
      title: "Cloud Computing Security Standards: Current State and Future Directions",
      authors: ["Lee, S.", "Novak, D.", "Ibrahim, M."],
      journal: "Journal of Cybersecurity",
      year: 2022,
      abstract: "A comprehensive review of security standards and compliance frameworks for cloud computing environments across various industries.",
      citations: 78,
      keywords: ["cloud computing", "security standards", "compliance", "cybersecurity"],
      url: "#"
    },
    {
      id: 7,
      title: "Employee Engagement in Remote Work Environments",
      authors: ["Rodriguez, C.", "White, T."],
      journal: "Human Resource Management Review",
      year: 2023,
      abstract: "Investigates strategies for maintaining employee engagement and productivity in distributed and remote work settings.",
      citations: 65,
      keywords: ["remote work", "employee engagement", "human resources", "productivity"],
      url: "#"
    },
    {
      id: 8,
      title: "Data Visualization Techniques for Complex Business Analytics",
      authors: ["Taylor, H.", "Kim, J."],
      journal: "Business Intelligence Quarterly",
      year: 2022,
      abstract: "Explores novel data visualization approaches to effectively communicate complex analytical insights to business stakeholders.",
      citations: 109,
      keywords: ["data visualization", "business analytics", "business intelligence", "decision support"],
      url: "#"
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [results, setResults] = useState(sampleData);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [authorFilter, setAuthorFilter] = useState("");
  const [journalFilter, setJournalFilter] = useState("");

  // Search function
  const handleSearch = () => {
    let filtered = [...sampleData];
    
    // Basic search term matching in title, abstract, and keywords
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(term) || 
        paper.abstract.toLowerCase().includes(term) ||
        paper.keywords.some(keyword => keyword.toLowerCase().includes(term)) ||
        paper.authors.some(author => author.toLowerCase().includes(term))
      );
    }
    
    // Year filter
    if (filterYear) {
      filtered = filtered.filter(paper => paper.year.toString() === filterYear);
    }
    
    // Author filter (advanced)
    if (authorFilter) {
      const authorTerm = authorFilter.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.authors.some(author => author.toLowerCase().includes(authorTerm))
      );
    }
    
    // Journal filter (advanced)
    if (journalFilter) {
      const journalTerm = journalFilter.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.journal.toLowerCase().includes(journalTerm)
      );
    }
    
    // Sort results
    if (sortBy === "citations") {
      filtered.sort((a, b) => b.citations - a.citations);
    } else if (sortBy === "year") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setResults(filtered);
  };

  // Handle paper selection
  const viewPaperDetails = (paper) => {
    setSelectedPaper(paper);
  };

  // Clear selection and go back to results
  const backToResults = () => {
    setSelectedPaper(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto flex-grow p-4">
        {!selectedPaper ? (
          <>
            {/* Search Interface */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by title, keyword, or author"
                    className="flex-grow border rounded-md px-4 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button 
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <select 
                      value={filterYear} 
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="border rounded-md px-3 py-1"
                    >
                      <option value="">All Years</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                    </select>
                    
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border rounded-md px-3 py-1"
                    >
                      <option value="relevance">Sort by Relevance</option>
                      <option value="citations">Sort by Citations</option>
                      <option value="year">Sort by Year</option>
                      <option value="title">Sort by Title</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => setAdvancedSearch(!advancedSearch)}
                    className="text-blue-600 text-sm"
                  >
                    {advancedSearch ? 'Simple Search' : 'Advanced Search'}
                  </button>
                </div>
                
                {advancedSearch && (
                  <div className="flex gap-4 mt-2">
                    <input
                      type="text"
                      placeholder="Filter by author"
                      className="flex-grow border rounded-md px-4 py-2"
                      value={authorFilter}
                      onChange={(e) => setAuthorFilter(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Filter by journal"
                      className="flex-grow border rounded-md px-4 py-2"
                      value={journalFilter}
                      onChange={(e) => setJournalFilter(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Results */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Results ({results.length})</h2>
              </div>
              
              <div className="divide-y">
                {results.length > 0 ? (
                  results.map(paper => (
                    <div key={paper.id} className="p-4 hover:bg-gray-50">
                      <h3 
                        className="text-lg text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => viewPaperDetails(paper)}
                      >
                        {paper.title}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {paper.authors.join(', ')} - {paper.journal}, {paper.year}
                      </div>
                      <p className="text-gray-700 mt-2 line-clamp-2">
                        {paper.abstract}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-500">
                          Citations: {paper.citations}
                        </div>
                        <div className="flex gap-1">
                          {paper.keywords.slice(0, 3).map((keyword, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No results found. Try adjusting your search criteria.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Paper Detail View */
          <div className="bg-white rounded-lg shadow p-6">
            <button 
              onClick={backToResults}
              className="text-blue-600 mb-4 flex items-center gap-1"
            >
              ← Back to results
            </button>
            
            <h2 className="text-2xl font-bold mb-4">{selectedPaper.title}</h2>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">
                <div><strong>Authors:</strong> {selectedPaper.authors.join(', ')}</div>
                <div><strong>Journal:</strong> {selectedPaper.journal}</div>
                <div><strong>Year:</strong> {selectedPaper.year}</div>
                <div><strong>Citations:</strong> {selectedPaper.citations}</div>
              </div>
              
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Access Paper
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Abstract</h3>
              <p className="text-gray-700">{selectedPaper.abstract}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Keywords</h3>
              <div className="flex gap-2 flex-wrap">
                {selectedPaper.keywords.map((keyword, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Related Papers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleData
                  .filter(paper => 
                    paper.id !== selectedPaper.id && 
                    paper.keywords.some(k => selectedPaper.keywords.includes(k))
                  )
                  .slice(0, 4)
                  .map(paper => (
                    <div key={paper.id} className="p-3 border rounded hover:bg-gray-50">
                      <h4 
                        className="text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => viewPaperDetails(paper)}
                      >
                        {paper.title}
                      </h4>
                      <div className="text-sm text-gray-500 mt-1">
                        {paper.authors.join(', ')} - {paper.year}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
