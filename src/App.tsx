import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  Compass,
  Cpu,
  MessageSquareText,
  Network as NetworkIcon,
} from 'lucide-react';
import { KnowledgeGraphExplorer } from './components/KnowledgeGraphExplorer';
import { ThinkerAvatar } from './components/ThinkerAvatar';
import { ThinkerModal } from './components/ThinkerModal';
import {
  keyQuestionsData,
  lineageStages,
  scheduleMilestones,
  teamMembers,
  thinkersData,
  type Thinker,
} from './data/archiveData';

export default function App() {
  const [selectedThinker, setSelectedThinker] = useState<Thinker | null>(null);
  const [focusedNodeRequest, setFocusedNodeRequest] = useState<{
    id: string;
    timestamp: number;
  } | null>(null);
  const [activeCypher, setActiveCypher] = useState<string>(keyQuestionsData[1].cypher);

  const handleFocusInGraph = (nodeId: string, cypher?: string) => {
    setSelectedThinker(null);
    if (cypher) {
      setActiveCypher(cypher);
    }
    setFocusedNodeRequest({ id: nodeId, timestamp: Date.now() });
    const el = document.getElementById('knowledge-graph');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Top Bar (Strict 3-zone contract: Wordmark — 4 Nav Links — 1 Primary CTA) */}
      <header className="sticky top-0 z-40 bg-[#F9F8F5]/95 backdrop-blur-md border-b border-[#E2DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#"
            className="font-serif font-bold text-base sm:text-lg text-stone-950 hover:text-[#8B1E1E] transition-colors whitespace-nowrap shrink-0"
          >
            인낫망 · 사회학 사상사 아카이브
          </a>

          <nav
            aria-label="주 메뉴"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700"
          >
            <a
              href="#overview"
              className="hover:text-[#8B1E1E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              01. 프로젝트 개요
            </a>
            <a
              href="#questions"
              className="hover:text-[#8B1E1E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              02. 핵심 질문 & 계보
            </a>
            <a
              href="#knowledge-graph"
              className="hover:text-[#8B1E1E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              03. 지식그래프
            </a>
            <a
              href="#team"
              className="hover:text-[#8B1E1E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              04. 팀 & 아카이브
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <a
              href="#knowledge-graph"
              className="px-4 py-2 text-xs font-semibold bg-stone-900 text-amber-100 hover:bg-[#8B1E1E] hover:text-white transition-colors rounded-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <NetworkIcon className="w-3.5 h-3.5" />
              <span>그래프 탐색기</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-20 border-b border-[#E2DCCF] bg-gradient-to-b from-[#F5F2EA] to-[#F9F8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Archival Header Metadata Line (Unboxed typographic separators) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-300 mb-10 text-xs font-mono text-stone-600 tabular-nums">
              <div>
                <span className="text-[#8B1E1E] font-bold">DOC ID 173-19-03</span>
                <span className="mx-2 text-stone-400">·</span>
                <span>COLA173-19 디지털인문학응용</span>
                <span className="mx-2 text-stone-400">·</span>
                <span>PUBLISHED 2026.09.30</span>
              </div>
              <div>
                <span>Neo4j Graph DB</span>
                <span className="mx-2 text-stone-400">·</span>
                <span>팀 인낫망 (강수이 · 윤지원 · 김민식)</span>
              </div>
            </div>

            {/* Hero Titles */}
            <div className="max-w-4xl mb-12">
              <p className="font-serif italic text-[#8B1E1E] text-base sm:text-lg mb-3">
                “철학자들은 세계를 단지 다양하게 해석했을 뿐이다. 중요한 것은 세계를 변화시키는 것이다.”
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-stone-950 leading-[1.22] mb-5">
                사회학 이론은 앞선 학자의 어떤 문제의식을{' '}
                <span className="text-[#8B1E1E] underline decoration-stone-300 underline-offset-8">
                  계승하고 비판하며
                </span>{' '}
                발전했는가?
              </h1>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed max-w-3xl">
                마르크스를 지적 허브(Hub) 축으로 삼아 독일 관념론에서 20세기 비판이론, 구조주의, 문화사회학으로 이어지는
                사상사의 계보를 <strong className="font-semibold text-stone-950">지식그래프(Knowledge Graph)</strong>로
                정밀하게 추상화하고 시각화합니다.
              </p>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 tabular-nums">
              <div className="p-4 bg-white border border-[#E2DCCF] rounded-sm">
                <div className="text-xs font-mono text-stone-500">주요 대상 사상가</div>
                <div className="text-2xl font-serif font-bold text-stone-950 mt-1">
                  10–12<span className="text-xs font-sans font-normal text-stone-500 ml-1">명</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">헤겔부터 부르디외까지</div>
              </div>
              <div className="p-4 bg-white border border-[#E2DCCF] rounded-sm">
                <div className="text-xs font-mono text-[#8B1E1E]">중심 지적 허브</div>
                <div className="text-2xl font-serif font-bold text-[#8B1E1E] mt-1">Karl Marx</div>
                <div className="text-xs text-stone-500 mt-1">역사적 유물론 · 자본주의 비판</div>
              </div>
              <div className="p-4 bg-white border border-[#E2DCCF] rounded-sm">
                <div className="text-xs font-mono text-stone-500">핵심 개념 &amp; 저서</div>
                <div className="text-2xl font-serif font-bold text-stone-950 mt-1">
                  60+<span className="text-xs font-sans font-normal text-stone-500 ml-1">Nodes</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">저서 20+권 · 개념 40+개</div>
              </div>
              <div className="p-4 bg-white border border-[#E2DCCF] rounded-sm">
                <div className="text-xs font-mono text-stone-500">온톨로지 관계 유형</div>
                <div className="text-2xl font-serif font-bold text-stone-950 mt-1">
                  10<span className="text-xs font-sans font-normal text-stone-500 ml-1">Types</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">비판적 승계 · 변용 · 저술</div>
              </div>
            </div>

            {/* 9 Key Thinker Cards */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-xs font-mono tracking-widest text-stone-800 font-bold">
                  계보상 핵심 인물 컬렉션 (카드를 선택하면 원전·개념 팝업이 열립니다)
                </h2>
                <span className="text-xs text-stone-500 font-mono">
                  {thinkersData.length} Curated Thinker Dossiers
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {thinkersData.map((thinker) => (
                  <button
                    key={thinker.id}
                    type="button"
                    onClick={() => setSelectedThinker(thinker)}
                    className={`text-left group relative bg-white p-5 rounded-sm border transition-all flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-[#8B1E1E] ${
                      thinker.isHub
                        ? 'border-[#8B1E1E] shadow-sm bg-[#FCF9F7]'
                        : 'border-[#E2DCCF] hover:border-stone-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-stone-500 mb-2 gap-2">
                        <span className="truncate">{thinker.era}</span>
                        <span className="text-stone-600 shrink-0">
                          {thinker.isHub ? 'Center Hub' : thinker.school.split(' ')[0]}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <ThinkerAvatar
                            thinkerId={thinker.id}
                            name={thinker.name}
                            sizeClass="w-11 h-11"
                          />
                          <div className="min-w-0">
                            <h3 className="font-serif font-bold text-lg text-stone-950 group-hover:text-[#8B1E1E] transition-colors truncate">
                              {thinker.name}
                            </h3>
                            <p className="text-xs font-mono text-stone-500 mt-0.5 truncate">
                              {thinker.originalName.split('(')[0].trim()}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B1E1E] transition-colors shrink-0 mt-1" />
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                        {thinker.bio}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-600 truncate">
                      {thinker.concepts.slice(0, 3).join(' · ')}
                      {thinker.concepts.length > 3 ? ` 외 ${thinker.concepts.length - 3}건` : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Executive Summary */}
        <section id="overview" className="py-20 border-b border-[#E2DCCF] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-6 border-b border-stone-200">
              <div>
                <span className="text-[#8B1E1E] font-mono text-xs font-bold tracking-widest block mb-1.5">
                  Chapter I · Executive Summary
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
                  프로젝트 개요
                </h2>
              </div>
              <p className="text-sm text-stone-600 max-w-md">
                파편화된 사회학 사상사를 <strong>개념 간 계승·비판·재구성</strong>의 동적 관계망으로 추상화하여 Graph DB 구조로 구현합니다.
              </p>
            </div>

            {/* 3-Column Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              <div className="p-6 bg-[#FAF8F5] border border-stone-200 rounded-sm">
                <div className="text-xs font-mono font-bold text-stone-500 mb-3">01 · 추진 배경</div>
                <h3 className="font-serif font-bold text-lg text-stone-950 mb-2">
                  나열식 이론 암기의 한계 극복
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  개별 이론의 나열식 암기만으로는 인물 간 역사적 비판점과 개념의 변용 관계를 파악하기 어렵습니다.
                  인문학적 원전 고증과 사회학적 이론 맥락화를 결합한 입체적 지식 지도가 필요합니다.
                </p>
              </div>

              <div className="p-6 bg-[#FAF8F5] border border-stone-200 rounded-sm">
                <div className="text-xs font-mono font-bold text-[#8B1E1E] mb-3">02 · 프로젝트 목적</div>
                <h3 className="font-serif font-bold text-lg text-stone-950 mb-2">
                  마르크스 중심 계보적 위상 규명
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  시간의 흐름에 따라 사회학 이론이 어떤 선행 학자의 사상을 옹호하고 비판하며 혁신했는지 추적하고,
                  각 학파의 고유한 문제의식과 중심축으로서 마르크스의 계보적 위상을 규명합니다.
                </p>
              </div>

              <div className="p-6 bg-[#FAF8F5] border border-stone-200 rounded-sm">
                <div className="text-xs font-mono font-bold text-[#B48448] mb-3">
                  03 · 대상 데이터 &amp; 산출물
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-950 mb-2">
                  Neo4j Graph DB 및 시각화
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  선정 학자의 생애 기본 정보, 대표 저작, 핵심 개념, 영향·비판 관계를 검증된 학술자료(SEP, Giddens 개론서 등)를 통해 수집하여
                  Neo4j Graph Database와 인터랙티브 탐색기로 구축합니다.
                </p>
              </div>
            </div>

            {/* Scope Table */}
            <div className="border border-stone-200 rounded-sm overflow-hidden bg-white">
              <div className="bg-stone-100 px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-serif font-bold text-base text-stone-950 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#8B1E1E]" />
                  <span>범위 정의 (Scope &amp; Boundary Control)</span>
                </h3>
                <span className="text-xs font-mono text-stone-500">노드 총 50–100건 내외 집중 제어</span>
              </div>

              <div className="divide-y divide-stone-200 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5">
                  <div className="font-semibold text-stone-900">포함 범위 (In-Scope)</div>
                  <div className="md:col-span-2 text-stone-700 space-y-1.5 text-xs sm:text-sm leading-relaxed">
                    <p>
                      • <strong>주요 학자 (10–12명):</strong> 헤겔, 포이어바흐 → 마르크스(축) → 엥겔스, 루카치, 그람시,
                      아도르노, 벤야민, 알튀세르, 하버마스, 부르디외
                    </p>
                    <p>
                      • <strong>대표 저서 (20–25권):</strong> 《자본론》, 《독일 이데올로기》, 《계몽의 변증법》, 《구별짓기》 등
                    </p>
                    <p>
                      • <strong>핵심 개념 (30–40개):</strong> 소외, 역사적 유물론, 물화, 도구적 이성, 아비투스 등
                    </p>
                    <p>
                      • <strong>사조/학파 (5–6개):</strong> 독일 관념론, 비판이론, 구조주의 마르크스주의, 문화사회학 등
                    </p>
                  </div>
                  <div className="text-xs text-stone-600 font-mono bg-stone-50 border border-stone-200 p-3 rounded-sm">
                    독일 지적 전통과 사회학적 계보의 교차점에 집중하여 고품질 온톨로지 구축
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-stone-50/50">
                  <div className="font-semibold text-stone-900">제외 범위 (Out-of-Scope)</div>
                  <div className="md:col-span-2 text-stone-700 space-y-1.5 text-xs sm:text-sm leading-relaxed">
                    <p>• <strong>미시사회학 및 실증/통계 전통 제외:</strong> 상징적 상호작용론(미드, 고프먼), 파슨스 구조기능주의 등</p>
                    <p>• <strong>비서구/동양 마르크스주의 제외:</strong> 마오쩌둥주의, 소련 레닌주의 세부 정파 배제</p>
                    <p>• <strong>21세기 최신 현대 이론가 제외:</strong> 지젝, 한병철 등 2000년대 이후 사상가 배제</p>
                    <p>• <strong>개인 신상 데이터 제외:</strong> 가족관계, 학력 세부사항 대신 사상적 텍스트/개념에 집중</p>
                  </div>
                  <div className="text-xs text-stone-600 font-mono bg-white border border-stone-200 p-3 rounded-sm">
                    ‘마르크스 중심의 20세기 이론 계보’ 정체성 유지 및 데이터 모델 단순화 확보
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5">
                  <div className="font-semibold text-stone-900">기준 시점 (Chronology)</div>
                  <div className="md:col-span-2 text-stone-700 text-xs sm:text-sm leading-relaxed">
                    18세기 후반(독일 관념론/헤겔) ~ 20세기 후반(부르디외의 문화사회학 및 하버마스 의사소통행위론 후기 이론)
                  </div>
                  <div className="text-xs text-stone-600 font-mono bg-stone-50 border border-stone-200 p-3 rounded-sm">
                    사회학 성립 직전의 철학적 토대부터 20세기 비판 사회이론 확립기까지 시간적 경계 설정
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Key Questions & Lineage */}
        <section id="questions" className="py-20 border-b border-[#E2DCCF] bg-[#F5F2EA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-6 border-b border-stone-300">
              <div>
                <span className="text-[#8B1E1E] font-mono text-xs font-bold tracking-widest block mb-1.5">
                  Chapter II · Research Questions
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
                  핵심 질문 &amp; 계보적 가설
                </h2>
              </div>
              <p className="text-sm text-stone-600 max-w-md">
                단순 단일 조회가 아닌 <strong>2개 이상의 홉(Hop) 관계</strong>를 경유해 답을 도출하는 구조적 질문입니다. 카드를 클릭하면 그래프 탐색기로 연결됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
              {keyQuestionsData.map((kq) => (
                <button
                  key={kq.id}
                  type="button"
                  onClick={() => handleFocusInGraph(kq.focusNodeId, kq.cypher)}
                  className={`text-left bg-white p-7 rounded-sm flex flex-col justify-between transition-all focus-visible:outline-2 focus-visible:outline-[#8B1E1E] ${
                    kq.isFeatured
                      ? 'border-2 border-[#8B1E1E] shadow-sm'
                      : 'border border-[#E2DCCF] hover:border-stone-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 text-xs font-mono">
                      <span className="font-bold text-[#8B1E1E]">{kq.number}</span>
                      <span className="text-stone-500">{kq.category}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-stone-950 leading-snug mb-4">
                      {kq.title}
                    </h3>
                    <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
                      {kq.highlights.map((h) => (
                        <p key={h.label}>
                          • <strong className="text-stone-800">{h.label}:</strong> {h.detail}
                        </p>
                      ))}
                      <p>
                        • <strong className="text-stone-800">필요 온톨로지 관계:</strong>{' '}
                        <span className="font-mono text-[#8B1E1E]">{kq.ontologies.join(', ')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-200 text-xs font-mono text-stone-600 flex items-center justify-between w-full">
                    <span>{kq.queryHint}</span>
                    <span className="inline-flex items-center gap-1 text-[#8B1E1E] font-semibold">
                      그래프에서 보기 <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Lineage Roadmap */}
            <div className="bg-stone-900 text-stone-200 p-8 rounded-sm border border-stone-800">
              <h3 className="font-serif font-bold text-lg text-amber-200 mb-6">
                마르크스 축 중심 사회이론 사상사 계보 흐름도
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                {lineageStages.map((item) => (
                  <div
                    key={item.stage}
                    className={`border-t-2 ${item.accent} pt-4 ${
                      item.isHub ? 'bg-white/5 p-4 rounded-b-sm' : ''
                    }`}
                  >
                    <span className="font-mono text-amber-300 text-[11px] block mb-1.5">
                      {item.stage}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-white mb-2">{item.title}</h4>
                    <p className="text-stone-300 leading-relaxed mb-3">{item.description}</p>
                    <div className="text-[11px] text-stone-400 font-mono">
                      주요 인물: {item.figures}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Knowledge Graph Explorer */}
        <KnowledgeGraphExplorer
          focusedNodeRequest={focusedNodeRequest}
          activeCypher={activeCypher}
          onCypherChange={setActiveCypher}
        />

        {/* Section 4: Team & Archive Specs */}
        <section id="team" className="py-20 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-6 border-b border-stone-300">
              <div>
                <span className="text-[#8B1E1E] font-mono text-xs font-bold tracking-widest block mb-1.5">
                  Chapter IV · Research Team &amp; Archive Specs
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
                  팀 소개 &amp; 데이터 아카이브 명세
                </h2>
              </div>
              <p className="text-sm text-stone-600 max-w-md">
                독어독문과의 <strong>원전 텍스트 고증 역량</strong>과 사회학과의 <strong>이론 맥락화 역량</strong>의 학제적 융합.
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-white border border-[#E2DCCF] p-6 rounded-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-11 h-11 rounded-full bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-base font-bold shrink-0">
                        {member.initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base text-stone-950">
                            {member.name}
                          </h3>
                          <span className="text-xs font-mono text-[#8B1E1E] font-semibold">
                            · {member.role}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-mono mt-0.5">{member.department}</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                      {member.description}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span>팀 인낫망 연구원</span>
                    <span>{member.track}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Quality & Project Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-[#E2DCCF] p-6 rounded-sm">
                <h3 className="font-serif font-bold text-base text-stone-950 mb-4 flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-[#B48448]" />
                  <span>데이터 확보 출처 및 품질 관리 기준</span>
                </h3>
                <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm">
                    <span className="font-bold text-stone-900 block mb-1">인물 및 서지 출처</span>
                    Deutsche Biographie, 독일국립도서관(DNB), 스탠퍼드 철학백과사전(SEP), 앤서니 기든스 《현대사회학》(을유문화사, 2018).
                  </div>
                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm">
                    <span className="font-bold text-stone-900 block mb-1">정확성 및 일관성</span>
                    학술적으로 확립된 고전 사회학 이론을 기초로 하여 변동 가능성을 극소화하고, 인명·저서명·개념명은 프로젝트 공통 표기법(한글 표준 + 독일어/프랑스어 원어 병기)을 준수합니다.
                  </div>
                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm">
                    <span className="font-bold text-stone-900 block mb-1">위험요인 대응</span>
                    마르크스 중심 인물 선정으로 인한 왜곡 방지를 위해, 분석 결과를 ‘선정된 비판 이론 연결망’ 내로 한정하여 일반화의 오류를 경계합니다.
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E2DCCF] p-6 rounded-sm">
                <h3 className="font-serif font-bold text-base text-stone-950 mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#8B1E1E]" />
                  <span>온톨로지 정제 및 프로젝트 추진 일정</span>
                </h3>
                <div className="space-y-4 text-xs text-stone-700">
                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm leading-relaxed">
                    <span className="font-bold text-stone-900 block mb-1">온톨로지 설계 및 교차 검토</span>
                    10개 노드 유형 후보를 브레인스토밍한 후 조원 2인 교차 검토를 통해 핵심 4개 클래스(인물, 저서, 개념, 사조)로 압축 및 정제하였습니다.
                  </div>

                  <div className="border border-stone-200 rounded-sm overflow-hidden">
                    <div className="bg-stone-100 px-3.5 py-2 font-bold text-stone-800 text-[11px] flex justify-between">
                      <span>추진 일정 (2026년 2학기 10주간)</span>
                      <span>주요 마일스톤</span>
                    </div>
                    <div className="divide-y divide-stone-100 text-[11px] font-mono tabular-nums">
                      {scheduleMilestones.map((row) => (
                        <div
                          key={row.weeks}
                          className="px-3.5 py-2 flex justify-between bg-white"
                        >
                          <span className="text-stone-900 font-medium">{row.weeks}</span>
                          <span className="text-stone-600">{row.milestone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-10 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <span className="font-serif font-bold text-white text-base">
                디지털인문학응용 (COLA173-19)
              </span>
              <p className="text-stone-400 mt-1">
                2026학년도 2학기 지식그래프 구축 프로젝트 아카이브 포트폴리오
              </p>
            </div>
            <div className="text-stone-300 font-mono">
              팀 인낫망 · 강수이 · 윤지원 · 김민식
            </div>
          </div>
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-stone-500 font-mono text-[11px] gap-2">
            <div>Sociology Theory Knowledge Graph Archive</div>
            <div>&copy; 2026 Team In-Nat-Mang.</div>
          </div>
        </div>
      </footer>

      <ThinkerModal
        thinker={selectedThinker}
        onClose={() => setSelectedThinker(null)}
        onFocusInGraph={(id) => handleFocusInGraph(id)}
      />

      {/* Quick Floating Jump Button to Knowledge Graph Chatbot */}
      <a
        href="#graph-chatbot"
        className="fixed bottom-5 right-5 z-30 px-4 py-2.5 bg-stone-950 text-amber-100 hover:bg-[#8B1E1E] hover:text-white border border-stone-700 shadow-lg rounded-sm text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
      >
        <MessageSquareText className="w-4 h-4 text-amber-300" />
        <span>챗봇 질문·검색</span>
      </a>
    </div>
  );
}
