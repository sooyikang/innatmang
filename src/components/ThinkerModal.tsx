import { useEffect } from 'react';
import { BookOpen, CircleDot, ExternalLink, Lightbulb, X } from 'lucide-react';
import { thinkerPortraits, type Thinker } from '../data/archiveData';
import { ThinkerAvatar } from './ThinkerAvatar';

interface ThinkerModalProps {
  thinker: Thinker | null;
  onClose: () => void;
  onFocusInGraph: (thinkerId: string) => void;
}

export function ThinkerModal({ thinker, onClose, onFocusInGraph }: ThinkerModalProps) {
  useEffect(() => {
    if (!thinker) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [thinker, onClose]);

  if (!thinker) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-thinker-name"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF8F5] border border-stone-300 rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="border border-amber-400/70 text-amber-300 px-2 py-0.5 tracking-widest text-[10px] font-semibold">
              PHILOSOPHER DOSSIER
            </span>
            <span className="text-stone-400">{thinker.era}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="text-stone-400 hover:text-white p-1.5 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scroll text-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="flex items-start gap-4">
              <ThinkerAvatar
                thinkerId={thinker.id}
                name={thinker.name}
                sizeClass="w-16 h-16"
                className="border-2 border-stone-300"
              />
              <div>
                <h3 id="modal-thinker-name" className="font-serif text-2xl font-bold text-stone-950">
                  {thinker.name}
                </h3>
                <p className="text-xs font-mono text-[#8B1E1E] font-medium mt-1">
                  {thinker.originalName}
                </p>
                <p className="text-xs text-stone-600 mt-1">{thinker.role}</p>
              </div>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-xs font-mono text-stone-700 border border-stone-300 bg-white px-2.5 py-1 rounded-sm inline-block">
                {thinker.school}
              </span>
            </div>
          </div>

          {thinkerPortraits[thinker.id] && (
            <div className="text-[11px] font-mono text-stone-500 bg-stone-100/80 border border-stone-200 px-3 py-2 rounded-sm space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>{thinkerPortraits[thinker.id].caption}</span>
                <a
                  href={thinkerPortraits[thinker.id].sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8B1E1E] hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>{thinkerPortraits[thinker.id].sourceLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {thinkerPortraits[thinker.id].cautionNote && (
                <div className="text-[10px] text-amber-900">
                  ※ {thinkerPortraits[thinker.id].cautionNote}
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-xs font-mono text-stone-500 font-semibold mb-1.5 tracking-wide">
              학술적 평가 및 문제의식
            </h4>
            <p className="text-sm leading-relaxed text-stone-700 bg-white p-4 border border-stone-200 rounded-sm">
              {thinker.bio}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-stone-500 font-semibold mb-2 flex items-center gap-1.5 tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-[#B48448]" />
              <span>대표 저서 (Key Texts)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {thinker.books.map((book) => (
                <div
                  key={book.title}
                  className="p-3 bg-white border border-stone-200 rounded-sm"
                >
                  <div className="font-bold text-stone-900 font-serif">{book.title}</div>
                  <div className="text-[11px] text-stone-500 font-mono italic mt-0.5">
                    {book.orig}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono text-stone-500 font-semibold mb-2 flex items-center gap-1.5 tracking-wide">
              <Lightbulb className="w-3.5 h-3.5 text-teal-700" />
              <span>핵심 정립 개념 (Key Concepts)</span>
            </h4>
            <p className="text-xs font-mono text-teal-900 bg-teal-50/70 border border-teal-200/80 px-3.5 py-2.5 rounded-sm leading-relaxed">
              {thinker.concepts.join(' · ')}
            </p>
          </div>

          <div className="border-t border-stone-200 pt-4">
            <h4 className="text-xs font-mono text-stone-500 font-semibold mb-1.5 tracking-wide">
              지식 계보상 연결 위치
            </h4>
            <p className="text-xs text-stone-700 bg-stone-100 p-3 rounded-sm font-mono leading-relaxed">
              {thinker.lineage}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex flex-wrap justify-between items-center gap-3 text-xs font-mono text-stone-500">
          <span>출처: 기든스 《현대사회학》 · SEP</span>
          <button
            type="button"
            onClick={() => onFocusInGraph(thinker.id)}
            className="px-4 py-2 bg-stone-900 text-amber-100 hover:bg-[#8B1E1E] hover:text-white rounded-sm text-xs transition-colors font-sans font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8B1E1E]"
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>그래프에서 노드 찾기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
