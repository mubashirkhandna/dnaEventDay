import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Configure the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PitchDeckViewerProps {
  url: string;
}

export default function PitchDeckViewer({ url }: PitchDeckViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [direction, setDirection] = useState(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const changePage = (offset: number) => {
    setDirection(offset);
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  // Animation variants for the slide effect
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  // Helper to extract Google Drive file ID if it's a Drive link
  const getDownloadUrl = (rawUrl: string) => {
    if (!rawUrl) return '';
    // If it's a direct Google Drive link, we can try to extract the ID and construct a download link.
    // NOTE: This will only work if the backend provides a valid CORS proxy or public direct download link.
    // Currently, Google Drive blocks direct access from the browser due to CORS.
    // The backend should ideally provide a route like `/api/proxy?url=${encodeURIComponent(rawUrl)}`
    return rawUrl;
  };

  const pdfUrl = getDownloadUrl(url);

  if (!url) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-void-950 text-slate-500">
        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
        <p>No Pitch Deck provided.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full bg-void-950 relative overflow-hidden h-full">
      <div className="flex-1 w-full flex items-center justify-center relative bg-void-900 overflow-hidden">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center text-brand-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center text-red-400 p-6 text-center">
              <AlertCircle className="w-10 h-10 mb-2" />
              <p className="font-bold mb-1">Failed to load PDF</p>
              <p className="text-sm opacity-80 max-w-sm">
                This is likely due to CORS restrictions from Google Drive. The backend needs to provide a direct, CORS-enabled PDF URL.
              </p>
            </div>
          }
          className="flex justify-center max-h-full"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={pageNumber}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Page 
                pageNumber={pageNumber} 
                className="max-h-full shadow-2xl" 
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                height={500} // Set a fixed height or let it scale, adjust based on your layout
              />
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>

      {/* Controls */}
      {numPages && (
        <div className="flex items-center justify-between w-full p-4 bg-void-950 border-t border-white/10 z-10">
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
            className="flex items-center gap-2 px-4 py-2 bg-void-800 text-white rounded-lg hover:bg-void-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          
          <div className="text-slate-400 font-mono text-sm">
            Page <span className="text-white font-bold">{pageNumber}</span> of {numPages}
          </div>

          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
            className="flex items-center gap-2 px-4 py-2 bg-void-800 text-white rounded-lg hover:bg-void-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
