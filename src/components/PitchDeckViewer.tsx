import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PitchDeckViewerProps {
  url: string;
}

export default function PitchDeckViewer({ url }: PitchDeckViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [direction, setDirection] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const slideAreaRef = useRef<HTMLDivElement>(null);

  // Measure the slide area so react-pdf can scale the page to fill it
  useEffect(() => {
    const el = slideAreaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerWidth(el.clientWidth);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const changePage = (offset: number) => {
    setDirection(offset);
    setPageNumber((p) => p + offset);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0, zIndex: 0 }),
  };

  // Route through backend proxy to bypass Google Drive CORS
  const getProxiedUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';
    const match = rawUrl.match(/[?&]id=([^&,\s]+)/);
    if (match) {
      return `/api/proxy/pdf?id=${match[1]}`;
    }
    return rawUrl;
  };

  const pdfUrl = getProxiedUrl(url);

  if (!url) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-void-950 text-slate-500">
        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
        <p>No Pitch Deck provided.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-void-950">
      {/* 16:9 slide viewport — standard presentation aspect ratio */}
      <div
        ref={slideAreaRef}
        className="w-full aspect-video bg-void-900 relative overflow-hidden"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="absolute inset-0 flex items-center justify-center text-brand-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }
          error={
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-6 text-center">
              <AlertCircle className="w-10 h-10 mb-2" />
              <p className="font-bold mb-1">Failed to load PDF</p>
              <p className="text-sm opacity-80 max-w-xs">
                Make sure the backend is running and the file is publicly shared on Google Drive.
              </p>
            </div>
          }
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={pageNumber}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 320, damping: 32 }, opacity: { duration: 0.15 } }}
              className="absolute inset-0 flex items-center justify-center bg-void-900"
            >
              {containerWidth > 0 && (
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-2xl"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>

      {/* Navigation controls */}
      {numPages && (
        <div className="flex items-center justify-between w-full px-4 py-3 bg-void-950 border-t border-white/10">
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={() => changePage(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-void-800 text-white rounded-lg hover:bg-void-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-slate-400 font-mono text-sm">
            Slide <span className="text-white font-bold">{pageNumber}</span> / {numPages}
          </span>

          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={() => changePage(1)}
            className="flex items-center gap-2 px-4 py-2 bg-void-800 text-white rounded-lg hover:bg-void-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
