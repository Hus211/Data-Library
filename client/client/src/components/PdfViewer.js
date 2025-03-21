import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error('PDF load error:', error);
    setError(true);
    setLoading(false);
  }

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages || 1);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className="pdf-viewer">
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error ? (
        <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600">Failed to load PDF. Please try downloading the file instead.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
            <div>
              <span className="font-medium">Page {pageNumber} of {numPages || '-'}</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className={`px-3 py-1 rounded ${pageNumber <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className={`px-3 py-1 rounded ${pageNumber >= numPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Next
              </button>
            </div>
          </div>
          
          <div className="flex justify-center bg-gray-800 p-4">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
            >
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
                scale={1.2}
              />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
