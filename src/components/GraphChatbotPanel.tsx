import { useState } from 'react';
import { Check, Copy, ExternalLink, MessageSquareText } from 'lucide-react';

const CHATBOT_URL = 'https://november-sociology-graph.fuzzygull13.chatgpt.site';

const SAMPLE_QUESTIONS = [
  '아비투스란 무엇인가요?',
  '마르크스와 헤겔의 관계는 어떻게 연결되나요?',
  '아도르노와 하버마스의 이론적 차이는 무엇인가요?',
  '《자본론》에 포함된 핵심 개념을 알려주세요.',
];

export function GraphChatbotPanel() {
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  const handleCopyPrompt = async (question: string) => {
    try {
      await navigator.clipboard.writeText(question);
      setCopiedQuestion(question);
      window.setTimeout(() => setCopiedQuestion(null), 1800);
    } catch {
      // Clipboard blocked silently; user can still read/type the sample question
    }
  };

  return (
    <div
      id="graph-chatbot"
      className="mt-8 bg-[#FAF8F5] border border-stone-300 rounded-sm overflow-hidden"
    >
      {/* Header Bar */}
      <div className="bg-stone-900 text-stone-100 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <MessageSquareText className="w-4 h-4 text-amber-300 shrink-0" />
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-white">
              사회학 이론 지식그래프 질의 챗봇
            </h3>
            <p className="text-[11px] text-stone-300">
              인물·저서·개념 사이의 관계를 자연어 질문으로 빠르게 검색하세요.
            </p>
          </div>
        </div>

        <a
          href={CHATBOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-mono bg-stone-800 hover:bg-[#8B1E1E] text-amber-100 hover:text-white border border-stone-700 rounded-sm transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <span>새 창에서 열기</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Quick Search Prompt Suggestions */}
      <div className="bg-stone-100 border-b border-stone-200 px-5 py-2.5 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-[11px] text-stone-600 font-semibold shrink-0">
          추천 질문 (클릭 시 복사):
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_QUESTIONS.map((q) => {
            const isCopied = copiedQuestion === q;
            return (
              <button
                key={q}
                type="button"
                onClick={() => handleCopyPrompt(q)}
                className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-300 hover:border-[#8B1E1E] rounded-sm text-xs text-stone-800 transition-colors inline-flex items-center gap-1.5"
              >
                <span>{q}</span>
                {isCopied ? (
                  <Check className="w-3 h-3 text-teal-700 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
        {copiedQuestion && (
          <span className="text-[11px] font-mono text-teal-800 ml-auto">
            복사됨 · 아래 입력창에 붙여넣기 하세요
          </span>
        )}
      </div>

      {/* Embedded Chatbot Iframe */}
      <div className="w-full h-[560px] bg-white">
        <iframe
          src={CHATBOT_URL}
          title="사회학 이론 지식그래프 챗봇"
          className="w-full h-full border-0"
          loading="lazy"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
