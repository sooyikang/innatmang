import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import Papa from 'papaparse';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';
import {
  ArrowDown,
  ArrowRight,
  CalendarRange,
  Check,
  Copy,
  Crosshair,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Info,
  MessageSquareText,
  Minus,
  MousePointerClick,
  Plus,
  RotateCcw,
  Search,
  Upload,
} from 'lucide-react';
import {
  eraTimelineData,
  initialGraphEdges,
  initialGraphNodes,
  keyQuestionsData,
  thinkerPortraits,
  type EraTimelineItem,
  type GraphEdgeData,
  type GraphNodeData,
  type NodeGroup,
} from '../data/archiveData';
import { GraphChatbotPanel } from './GraphChatbotPanel';
import { ThinkerAvatar } from './ThinkerAvatar';

interface KnowledgeGraphExplorerProps {
  focusedNodeRequest: { id: string; timestamp: number } | null;
  activeCypher: string;
  onCypherChange: (cypher: string) => void;
}

type FilterValue = 'ALL' | '인물' | '인물-저서' | '저서-개념' | '시대';

interface InspectorNodeState {
  kind: 'node';
  id: string;
  label: string;
  group: string;
  neighbors: {
    edgeLabel: string;
    direction: '→' | '←';
    targetId: string;
    targetLabel: string;
  }[];
}

interface InspectorEdgeState {
  kind: 'edge';
  label: string;
  fromLabel: string;
  fromGroup: string;
  toLabel: string;
  toGroup: string;
}

interface InspectorEraState {
  kind: 'era';
  era: EraTimelineItem;
}

type InspectorState = InspectorNodeState | InspectorEdgeState | InspectorEraState | null;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: '인물', label: '인물' },
  { value: '인물-저서', label: '인물-저서' },
  { value: '저서-개념', label: '저서-개념' },
  { value: '시대', label: '시대' },
];

const TIMELINE_MIN = 1770;
const TIMELINE_MAX = 2026;
const TIMELINE_SPAN = TIMELINE_MAX - TIMELINE_MIN;
const TIMELINE_TICKS = [1770, 1830, 1890, 1950, 2026];

export function KnowledgeGraphExplorer({
  focusedNodeRequest,
  activeCypher,
  onCypherChange,
}: KnowledgeGraphExplorerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesDataSetRef = useRef<DataSet<GraphNodeData>>(new DataSet(initialGraphNodes));
  const edgesDataSetRef = useRef<DataSet<GraphEdgeData>>(new DataSet(initialGraphEdges));

  const [isLoading, setIsLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState<FilterValue>('ALL');
  const [selectedEraId, setSelectedEraId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [nodeCount, setNodeCount] = useState(initialGraphNodes.length);
  const [edgeCount, setEdgeCount] = useState(initialGraphEdges.length);
  const [inspector, setInspector] = useState<InspectorState>(null);
  const [csvNotice, setCsvNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedCypher, setCopiedCypher] = useState(false);

  const inspectNode = useCallback((nodeId: string) => {
    const nodesDS = nodesDataSetRef.current;
    const edgesDS = edgesDataSetRef.current;
    const net = networkRef.current;
    const node = nodesDS.get(nodeId);
    if (!node || !net) return;

    const connectedEdgeIds = net.getConnectedEdges(nodeId);
    const neighbors = connectedEdgeIds
      .map((eId) => {
        const edge = edgesDS.get(eId);
        if (!edge || edge.hidden) return null;
        const isOutgoing = edge.from === nodeId;
        const targetId = isOutgoing ? edge.to : edge.from;
        const targetNode = nodesDS.get(targetId);
        if (!targetNode || targetNode.hidden) return null;
        return {
          edgeLabel: edge.label || '연결됨',
          direction: (isOutgoing ? '→' : '←') as '→' | '←',
          targetId,
          targetLabel: targetNode.label.replace('\n', ' '),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    setInspector({
      kind: 'node',
      id: node.id,
      label: node.label.replace('\n', ' '),
      group: node.group || 'Node',
      neighbors,
    });
  }, []);

  const inspectEdge = useCallback((edgeId: string) => {
    const nodesDS = nodesDataSetRef.current;
    const edgesDS = edgesDataSetRef.current;
    const edge = edgesDS.get(edgeId);
    if (!edge) return;
    const fromNode = nodesDS.get(edge.from);
    const toNode = nodesDS.get(edge.to);

    setInspector({
      kind: 'edge',
      label: edge.label || '연결',
      fromLabel: fromNode ? fromNode.label.replace('\n', ' ') : edge.from,
      fromGroup: fromNode?.group || '',
      toLabel: toNode ? toNode.label.replace('\n', ' ') : edge.to,
      toGroup: toNode?.group || '',
    });
  }, []);

  const focusAndSelectNode = useCallback(
    (nodeId: string, scale = 1.25) => {
      const net = networkRef.current;
      const nodesDS = nodesDataSetRef.current;
      if (!net) return;
      const target = nodesDS.get(nodeId);
      if (!target) return;

      const edgesDS = edgesDataSetRef.current;
      setFilterGroup((prev) => {
        if (prev === '시대' || target.hidden) {
          nodesDS.forEach((n) => nodesDS.update({ id: n.id, hidden: false }));
          edgesDS.forEach((e) => {
            if (e.id) edgesDS.update({ id: e.id, hidden: false });
          });
          return 'ALL';
        }
        return prev;
      });

      window.requestAnimationFrame(() => {
        net.redraw();
        net.focus(nodeId, {
          scale,
          animation: { duration: 700, easingFunction: 'easeInOutQuad' },
        });
        net.selectNodes([nodeId]);
        inspectNode(nodeId);
      });
    },
    [inspectNode]
  );

  // Initialize Vis-Network
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodesDS = nodesDataSetRef.current;
    const edgesDS = edgesDataSetRef.current;

    const network = new Network(
      container,
      { nodes: nodesDS, edges: edgesDS },
      {
        nodes: {
          font: {
            face: 'Noto Sans KR, sans-serif',
            color: '#1c1917',
            size: 12,
          },
          borderWidth: 2,
          shapeProperties: {
            useBorderWithImage: true,
            interpolation: true,
          },
          color: {
            border: '#44403c',
            background: '#FAF8F5',
            highlight: { border: '#8B1E1E', background: '#FEE2E2' },
          },
          shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.08)',
            size: 8,
            x: 2,
            y: 2,
          },
        },
        edges: {
          color: { color: '#A8A29E', highlight: '#8B1E1E' },
          font: {
            face: 'Noto Sans KR, sans-serif',
            size: 10,
            align: 'middle',
            background: '#FAF8F5',
          },
          smooth: { enabled: true, type: 'continuous', roundness: 0.5 },
          arrows: { to: { enabled: true, scaleFactor: 0.6 } },
        },
        physics: {
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -42,
            centralGravity: 0.008,
            springLength: 92,
            springConstant: 0.08,
            damping: 0.4,
          },
          stabilization: { iterations: 120 },
        },
        interaction: {
          hover: true,
          zoomView: true,
        },
      }
    );

    networkRef.current = network;

    network.once('stabilizationIterationsDone', () => {
      setIsLoading(false);
      setNodeCount(nodesDS.length);
      setEdgeCount(edgesDS.length);
    });

    const fallbackTimer = window.setTimeout(() => setIsLoading(false), 1200);

    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        inspectNode(String(params.nodes[0]));
      } else if (params.edges.length > 0) {
        inspectEdge(String(params.edges[0]));
      } else {
        setInspector(null);
      }
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      network.destroy();
      networkRef.current = null;
    };
  }, [inspectEdge, inspectNode]);

  // Respond to external focus requests (e.g. from Thinker Modal or Key Question)
  useEffect(() => {
    if (!focusedNodeRequest) return;
    focusAndSelectNode(focusedNodeRequest.id, 1.25);
  }, [focusedNodeRequest, focusAndSelectNode]);

  // Handle Filter Change
  const handleFilterChange = (group: FilterValue) => {
    setFilterGroup(group);

    if (group === '시대') {
      setSelectedEraId(eraTimelineData[1].id);
      setInspector({ kind: 'era', era: eraTimelineData[1] });
      return;
    }

    setSelectedEraId(null);
    const nodesDS = nodesDataSetRef.current;
    const edgesDS = edgesDataSetRef.current;

    const isNodeVisible = (nodeGroup: NodeGroup): boolean => {
      if (group === 'ALL') return true;
      if (group === '인물') return nodeGroup === '인물';
      if (group === '인물-저서') return nodeGroup === '인물' || nodeGroup === '저서';
      if (group === '저서-개념') return nodeGroup === '저서' || nodeGroup === '개념';
      return true;
    };

    nodesDS.forEach((node) => {
      nodesDS.update({
        id: node.id,
        hidden: !isNodeVisible(node.group),
      });
    });

    edgesDS.forEach((edge) => {
      if (!edge.id) return;
      const fromNode = nodesDS.get(edge.from);
      const toNode = nodesDS.get(edge.to);
      if (!fromNode || !toNode) return;

      let showEdge = true;
      if (group === '인물') {
        showEdge = fromNode.group === '인물' && toNode.group === '인물';
      } else if (group === '인물-저서') {
        showEdge =
          (fromNode.group === '인물' && toNode.group === '저서') ||
          (fromNode.group === '저서' && toNode.group === '인물');
      } else if (group === '저서-개념') {
        showEdge =
          (fromNode.group === '저서' && toNode.group === '개념') ||
          (fromNode.group === '개념' && toNode.group === '저서') ||
          (fromNode.group === '개념' && toNode.group === '개념');
      }

      edgesDS.update({
        id: edge.id,
        hidden: !showEdge,
      });
    });

    const visibleNodesCount = nodesDS.get().filter((n) => !n.hidden).length;
    const visibleEdgesCount = edgesDS.get().filter((e) => !e.hidden).length;
    setNodeCount(visibleNodesCount);
    setEdgeCount(visibleEdgesCount);

    window.requestAnimationFrame(() => {
      networkRef.current?.redraw();
      networkRef.current?.fit({
        animation: { duration: 450, easingFunction: 'easeInOutQuad' },
      });
    });
  };

  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    const match = nodesDataSetRef.current
      .get()
      .find((n) => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q));
    if (match) {
      focusAndSelectNode(match.id, 1.35);
      setCsvNotice(null);
    } else {
      setCsvNotice({
        type: 'error',
        message: `'${searchQuery}'와 일치하는 노드를 찾지 못했습니다.`,
      });
    }
  };

  // Handle Physics Toggle
  const handleTogglePhysics = () => {
    const next = !physicsEnabled;
    setPhysicsEnabled(next);
    networkRef.current?.setOptions({ physics: { enabled: next } });
  };

  // Parse CSV
  const processCsvFile = (file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const nodesDS = nodesDataSetRef.current;
        const edgesDS = edgesDataSetRef.current;
        let addedNodes = 0;
        let addedEdges = 0;

        results.data.forEach((row, idx) => {
          if (row.from && row.to) {
            edgesDS.add({
              id: `imported_e_${Date.now()}_${idx}`,
              from: row.from.trim(),
              to: row.to.trim(),
              label: row.label || row.type || '연결',
              arrows: 'to',
              color: { color: '#B48448' },
            });
            addedEdges += 1;
          } else if (row.id && (row.label || row.name)) {
            const label = (row.label || row.name).trim();
            const rawGroup = (row.group || row.class || '개념').trim();
            const group: NodeGroup =
              rawGroup === '인물' || rawGroup === '저서' || rawGroup === '사조' || rawGroup === '개념'
                ? rawGroup
                : '개념';
            nodesDS.update({
              id: row.id.trim(),
              label,
              group,
              shape:
                group === '인물'
                  ? 'dot'
                  : group === '저서'
                  ? 'box'
                  : group === '사조'
                  ? 'diamond'
                  : 'ellipse',
              color:
                group === '인물'
                  ? '#8B1E1E'
                  : group === '저서'
                  ? '#B48448'
                  : group === '사조'
                  ? '#4338CA'
                  : '#0F766E',
            });
            addedNodes += 1;
          }
        });

        setNodeCount(nodesDS.length);
        setEdgeCount(edgesDS.length);
        setCsvNotice({
          type: 'success',
          message: `CSV 반영 완료: ${addedNodes}개 노드, ${addedEdges}개 관계가 그래프에 병합되었습니다.`,
        });
      },
      error: (err) => {
        setCsvNotice({
          type: 'error',
          message: `CSV 파싱 오류: ${err.message}`,
        });
      },
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processCsvFile(file);
      e.target.value = '';
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processCsvFile(file);
    }
  };

  const handleDownloadSampleCsv = () => {
    const sample = [
      'id,label,group,from,to,type',
      'p_horkheimer,막스 호르크하이머,인물,,,',
      'c_trad_theory,전통이론 vs 비판이론,개념,,,',
      ',,,p_horkheimer,s_frankfurt,주도',
      ',,,p_horkheimer,b_dialectic_enlight,공저',
      ',,,p_horkheimer,c_trad_theory,개념 정립',
    ].join('\n');
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sociology_kg_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCypher = async () => {
    try {
      await navigator.clipboard.writeText(activeCypher);
      setCopiedCypher(true);
      window.setTimeout(() => setCopiedCypher(false), 1800);
    } catch {
      setCsvNotice({
        type: 'error',
        message: '클립보드 접근이 차단되어 수동 복사가 필요합니다.',
      });
    }
  };

  const isEraMode = filterGroup === '시대';

  return (
    <section id="knowledge-graph" className="py-20 border-b border-[#E2DCCF] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Legend */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-stone-200">
          <div>
            <span className="text-[#8B1E1E] font-mono text-xs font-bold tracking-widest block mb-1.5">
              Chapter III · Interactive Topology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
              Neo4j 지식그래프 탐색기
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-2xl">
              인물·저서 중심 네트워크와 시대별 사조·인물 계보 막대 타임라인을 전환하며 탐색하십시오.
            </p>
          </div>

          {/* Class Color Key */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-700">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B1E1E]" aria-hidden="true" />
              인물 (Person)
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 bg-[#B48448]" aria-hidden="true" />
              저서 (Book)
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-3 h-2 rounded-full bg-[#0F766E]" aria-hidden="true" />
              개념 (Concept)
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rotate-45 bg-[#4338CA]" aria-hidden="true" />
              사조 (School)
            </span>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Graph Canvas / Era Bar Column */}
          <div className="lg:col-span-8 flex flex-col bg-stone-50 border border-stone-300 rounded-sm overflow-hidden">
            {/* Toolbar */}
            <div className="bg-stone-100 border-b border-stone-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Interactive Segmented Filter (전체 / 인물 / 저서 / 시대) */}
                <div
                  className="inline-flex items-center p-0.5 bg-stone-200/80 rounded-sm"
                  role="group"
                  aria-label="그래프 탐색기 보기 탭"
                >
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleFilterChange(opt.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                        filterGroup === opt.value
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {opt.value === '시대' && <CalendarRange className="w-3.5 h-3.5 text-[#8B1E1E]" />}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => focusAndSelectNode('p_marx', 1.4)}
                  className="bg-stone-900 text-amber-100 hover:bg-[#8B1E1E] hover:text-white px-3 py-1.5 rounded-sm text-xs transition-colors font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>마르크스 중심</span>
                </button>

                <a
                  href="#graph-chatbot"
                  className="bg-white text-stone-800 border border-stone-300 hover:border-[#8B1E1E] hover:text-[#8B1E1E] px-3 py-1.5 rounded-sm text-xs transition-colors font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>질문 챗봇 검색</span>
                </a>
              </div>

              {/* Search & Canvas Controls */}
              <div className="flex items-center gap-2">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="노드 검색..."
                    aria-label="노드 이름 검색"
                    className="pl-8 pr-2.5 py-1 w-32 sm:w-40 bg-white border border-stone-300 rounded-sm text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-600"
                  />
                </form>

                {!isEraMode && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const net = networkRef.current;
                        if (net) net.moveTo({ scale: net.getScale() * 1.25 });
                      }}
                      title="확대"
                      aria-label="그래프 확대"
                      className="w-7 h-7 bg-white border border-stone-300 rounded-sm hover:bg-stone-200 text-stone-700 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const net = networkRef.current;
                        if (net) net.moveTo({ scale: net.getScale() * 0.8 });
                      }}
                      title="축소"
                      aria-label="그래프 축소"
                      className="w-7 h-7 bg-white border border-stone-300 rounded-sm hover:bg-stone-200 text-stone-700 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        networkRef.current?.fit({
                          animation: { duration: 550, easingFunction: 'easeInOutQuad' },
                        })
                      }
                      title="전체 뷰 리셋"
                      aria-label="그래프 뷰 리셋"
                      className="w-7 h-7 bg-white border border-stone-300 rounded-sm hover:bg-stone-200 text-stone-700 flex items-center justify-center"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleTogglePhysics}
                      aria-pressed={physicsEnabled}
                      className={`px-2.5 h-7 border border-stone-300 rounded-sm font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 ${
                        physicsEnabled
                          ? 'bg-white text-stone-800 hover:bg-stone-200'
                          : 'bg-stone-300 text-stone-900'
                      }`}
                    >
                      {physicsEnabled ? '물리: 켜짐' : '물리: 고정'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Viewport: Network Canvas OR Era Bar Timeline */}
            <div className="relative w-full min-h-[540px] bg-[#FAF9F5]">
              {/* Vis-network container stays mounted for instant tab switching */}
              <div
                ref={containerRef}
                className={isEraMode ? 'hidden' : 'w-full h-[540px]'}
              />

              {!isEraMode && isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#FAF9F5]/85 z-10">
                  <div className="text-center font-mono text-xs text-stone-600">
                    <div className="w-5 h-5 border-2 border-[#8B1E1E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <div>지식그래프 온톨로지 배치 중...</div>
                  </div>
                </div>
              )}

              {/* Era Bar Timeline View */}
              {isEraMode && (
                <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[600px] custom-scroll">
                  {/* Top Year Axis Ruler */}
                  <div className="border-b border-stone-300 pb-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-2">
                      <span>시대별 계보 타임라인 (1770 – 현재)</span>
                      <span>막대 · 사조 · 인물을 클릭해 우측 인스펙터에서 상세 확인</span>
                    </div>
                    <div className="relative h-5">
                      {TIMELINE_TICKS.map((year) => {
                        const leftPct = ((year - TIMELINE_MIN) / TIMELINE_SPAN) * 100;
                        return (
                          <span
                            key={year}
                            style={{ left: `${leftPct}%` }}
                            className={`absolute top-0 text-[11px] font-mono text-stone-500 tabular-nums ${
                              year === TIMELINE_MAX
                                ? '-translate-x-full'
                                : year === TIMELINE_MIN
                                ? 'translate-x-0'
                                : '-translate-x-1/2'
                            }`}
                          >
                            {year === 2026 ? '현재' : year}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Era Bars List */}
                  <div className="space-y-4">
                    {eraTimelineData.map((era) => {
                      const leftPct = ((era.startYear - TIMELINE_MIN) / TIMELINE_SPAN) * 100;
                      const widthPct = Math.max(
                        18,
                        ((era.endYear - era.startYear) / TIMELINE_SPAN) * 100
                      );
                      const isSelected = selectedEraId === era.id;

                      return (
                        <div
                          key={era.id}
                          className={`bg-white border rounded-sm p-4 transition-colors ${
                            isSelected
                              ? 'border-[#8B1E1E] shadow-xs'
                              : 'border-stone-300 hover:border-stone-400'
                          }`}
                        >
                          {/* Era Title Header */}
                          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
                            <div className="flex items-baseline gap-2.5">
                              <span className="font-mono text-xs font-bold text-[#8B1E1E] tabular-nums">
                                {era.period}
                              </span>
                              <h3 className="font-serif font-bold text-sm sm:text-base text-stone-950">
                                {era.title}
                              </h3>
                            </div>
                            <span className="text-[11px] font-mono text-stone-500">
                              {era.eraLabel}
                            </span>
                          </div>

                          {/* Chronological Horizontal Bar Track (막대기) */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEraId(era.id);
                              setInspector({ kind: 'era', era });
                            }}
                            className="relative w-full h-9 bg-stone-100 border border-stone-200 rounded-sm overflow-hidden mb-3.5 text-left group focus-visible:outline-2 focus-visible:outline-[#8B1E1E]"
                            aria-label={`${era.eraLabel} 시대 막대 선택`}
                          >
                            {/* Subtle vertical grid lines matching ticks */}
                            {TIMELINE_TICKS.slice(1, -1).map((tick) => (
                              <span
                                key={tick}
                                style={{
                                  left: `${((tick - TIMELINE_MIN) / TIMELINE_SPAN) * 100}%`,
                                }}
                                className="absolute inset-y-0 w-px bg-stone-200/80 pointer-events-none"
                                aria-hidden="true"
                              />
                            ))}

                            {/* Era Proportional Bar */}
                            <div
                              style={{
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                                backgroundColor: era.barColor,
                              }}
                              className="absolute inset-y-1 rounded-xs px-2.5 flex items-center justify-between text-white shadow-xs transition-opacity group-hover:opacity-95"
                            >
                              <span className="text-[11px] font-mono font-semibold truncate">
                                {era.period}
                              </span>
                              <span className="text-[10px] font-mono text-white/85 hidden sm:inline shrink-0 ml-2">
                                {era.isHub ? '지적 허브' : `${era.thinkers.length}명`}
                              </span>
                            </div>
                          </button>

                          {/* Connected Schools & Thinkers at a glance */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                            {/* Connected Schools */}
                            <div className="md:col-span-4 border-t md:border-t-0 md:border-r border-stone-200 pt-2 md:pt-0 md:pr-3">
                              <div className="text-[11px] font-mono text-stone-500 mb-1.5">
                                연결 사조 (Schools)
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {era.schools.map((school) => (
                                  <button
                                    key={`${era.id}-${school.id}`}
                                    type="button"
                                    onClick={() => inspectNode(school.id)}
                                    className="px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 rounded-sm transition-colors text-left"
                                  >
                                    ◆ {school.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Connected Thinkers */}
                            <div className="md:col-span-8 pt-2 md:pt-0">
                              <div className="text-[11px] font-mono text-stone-500 mb-1.5">
                                연결 인물 (Thinkers)
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {era.thinkers.map((person) => (
                                  <button
                                    key={person.id}
                                    type="button"
                                    onClick={() => inspectNode(person.id)}
                                    className={`px-2.5 py-1.5 rounded-sm border text-left transition-colors flex items-center gap-2.5 ${
                                      person.isHub
                                        ? 'bg-[#FCF5F5] border-[#8B1E1E] text-stone-950 hover:bg-red-50'
                                        : 'bg-stone-50 border-stone-200 text-stone-900 hover:border-stone-400 hover:bg-white'
                                    }`}
                                  >
                                    <ThinkerAvatar
                                      thinkerId={person.id}
                                      name={person.name}
                                      sizeClass="w-8 h-8"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-1">
                                        <span className="font-serif font-bold text-xs truncate">
                                          {person.name}
                                        </span>
                                        <span className="text-[10px] font-mono text-stone-500 tabular-nums shrink-0">
                                          {person.lifespan}
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-stone-600 truncate mt-0.5">
                                        {person.focus}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Footer */}
            <div className="bg-stone-100 border-t border-stone-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-stone-600 tabular-nums">
              {isEraMode ? (
                <>
                  <div>
                    <span>4 Eras</span>
                    <span className="mx-2 text-stone-400">·</span>
                    <span>5 Schools</span>
                    <span className="mx-2 text-stone-400">·</span>
                    <span>12 Thinkers</span>
                  </div>
                  <div>시대 막대 · 사조 · 인물 클릭 시 우측 인스펙터 연동</div>
                </>
              ) : (
                <>
                  <div>
                    <span>{nodeCount} Nodes</span>
                    <span className="mx-2 text-stone-400">·</span>
                    <span>{edgeCount} Edges</span>
                  </div>
                  <div>마우스 휠: 줌 인/아웃 · 노드 클릭 및 드래그 탐색</div>
                </>
              )}
            </div>
          </div>

          {/* Right Inspector & CSV Importer Column */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Inspector Card */}
            <div className="bg-white border border-stone-300 rounded-sm p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
                <span className="font-mono text-xs font-bold text-[#8B1E1E] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Node Inspector</span>
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  {inspector
                    ? inspector.kind === 'node'
                      ? inspector.group
                      : inspector.kind === 'era'
                      ? 'Era Timeline'
                      : 'Relationship'
                    : '선택 대기'}
                </span>
              </div>

              <div className="text-sm flex-1 overflow-y-auto max-h-[320px] custom-scroll">
                {!inspector && (
                  <div className="text-center py-12 text-stone-500">
                    <MousePointerClick className="w-6 h-6 mx-auto mb-2.5 text-stone-400" />
                    <p className="text-xs leading-relaxed">
                      왼쪽 그래프에서 노드나 연결선, 또는 시대 막대를 클릭하면
                      <br />
                      세부 속성과 인접 관계가 표시됩니다.
                    </p>
                  </div>
                )}

                {inspector?.kind === 'era' && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-mono text-[#8B1E1E] font-semibold tabular-nums">
                        {inspector.era.period} · {inspector.era.eraLabel}
                      </div>
                      <h3 className="font-serif font-bold text-lg text-stone-950 mt-0.5">
                        {inspector.era.title}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-sm border border-stone-200">
                      {inspector.era.summary}
                    </p>

                    <div>
                      <span className="text-xs font-mono font-semibold text-stone-600 block mb-1.5">
                        연결된 사조
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {inspector.era.schools.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => focusAndSelectNode(s.id, 1.25)}
                            className="px-2 py-1 text-xs bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-sm hover:bg-indigo-100"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-mono font-semibold text-stone-600 block mb-1.5">
                        연결된 인물 (클릭 시 그래프 이동)
                      </span>
                      <ul className="divide-y divide-stone-100">
                        {inspector.era.thinkers.map((t) => (
                          <li key={t.id} className="py-1.5 flex items-center justify-between gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => focusAndSelectNode(t.id, 1.3)}
                              className="font-serif font-bold text-stone-900 hover:text-[#8B1E1E] inline-flex items-center gap-1"
                            >
                              <span>{t.name}</span>
                              <ArrowRight className="w-3 h-3 text-stone-400" />
                            </button>
                            <span className="font-mono text-[11px] text-stone-500 tabular-nums">
                              {t.lifespan}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs font-mono font-semibold text-stone-600 block mb-1">
                        시대 핵심 개념
                      </span>
                      <p className="text-xs font-mono text-teal-900 bg-teal-50 border border-teal-200 px-2.5 py-2 rounded-sm">
                        {inspector.era.keyConcepts.join(' · ')}
                      </p>
                    </div>
                  </div>
                )}

                {inspector?.kind === 'node' && (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        {inspector.group === '인물' && (
                          <ThinkerAvatar
                            thinkerId={inspector.id}
                            name={inspector.label}
                            sizeClass="w-12 h-12"
                          />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-serif font-bold text-lg text-stone-950 truncate">
                            {inspector.label}
                          </h3>
                          <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                            ID: {inspector.id} · Class: {inspector.group}
                          </div>
                        </div>
                      </div>
                      {isEraMode && (
                        <button
                          type="button"
                          onClick={() => focusAndSelectNode(inspector.id, 1.3)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-stone-900 text-amber-100 hover:bg-[#8B1E1E] rounded-sm shrink-0 whitespace-nowrap"
                        >
                          그래프에서 보기
                        </button>
                      )}
                    </div>

                    {thinkerPortraits[inspector.id] && (
                      <div className="text-[11px] font-mono text-stone-600 bg-stone-50 border border-stone-200 px-2.5 py-2 rounded-sm space-y-1">
                        <div>{thinkerPortraits[inspector.id].caption}</div>
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={thinkerPortraits[inspector.id].sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B1E1E] hover:underline inline-flex items-center gap-1"
                          >
                            <span>출처: {thinkerPortraits[inspector.id].sourceLabel}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href={thinkerPortraits[inspector.id].googleSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-500 hover:text-stone-800 hover:underline inline-flex items-center gap-1"
                          >
                            <span>구글 이미지 검색</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        {thinkerPortraits[inspector.id].cautionNote && (
                          <div className="text-[10px] text-amber-900">
                            ※ {thinkerPortraits[inspector.id].cautionNote}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-stone-50 p-3 rounded-sm border border-stone-200 text-xs space-y-1 tabular-nums">
                      <div>
                        <strong className="text-stone-800">연결 차수(Degree):</strong>{' '}
                        {inspector.neighbors.length}개 연결
                      </div>
                      <div>
                        <strong className="text-stone-800">지식그래프 위상:</strong>{' '}
                        {inspector.id === 'p_marx'
                          ? '최고 중심성 (Central Axis Hub)'
                          : '서구 사회학 계보 연결 노드'}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-mono font-semibold text-stone-600 block mb-1.5">
                        인접 관계 네트워크
                      </span>
                      <ul className="divide-y divide-stone-100">
                        {inspector.neighbors.length > 0 ? (
                          inspector.neighbors.map((rel, idx) => (
                            <li
                              key={`${rel.targetId}-${idx}`}
                              className="flex items-center justify-between py-1.5 text-xs gap-2"
                            >
                              <span className="font-mono text-stone-500 shrink-0">
                                {rel.edgeLabel} {rel.direction}
                              </span>
                              <button
                                type="button"
                                onClick={() => focusAndSelectNode(rel.targetId, 1.25)}
                                className="font-medium text-stone-900 hover:text-[#8B1E1E] hover:underline text-right truncate"
                              >
                                {rel.targetLabel}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="text-xs text-stone-400 py-2">연결된 관계 없음</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {inspector?.kind === 'edge' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-mono text-[#8B1E1E] font-semibold">
                        Relationship Edge
                      </span>
                      <h3 className="font-serif font-bold text-base text-stone-900 mt-0.5">
                        {inspector.label}
                      </h3>
                    </div>
                    <div className="bg-stone-50 p-3.5 rounded-sm border border-stone-200 text-xs space-y-2.5">
                      <div>
                        <span className="text-stone-500 block text-[11px] font-mono">
                          출발 노드 (Start)
                        </span>
                        <strong className="text-stone-900 text-sm font-serif">
                          {inspector.fromLabel}
                        </strong>
                        {inspector.fromGroup && (
                          <span className="text-[11px] text-stone-500 font-mono ml-1.5">
                            ({inspector.fromGroup})
                          </span>
                        )}
                      </div>
                      <div className="text-stone-400 flex justify-center">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[11px] font-mono">
                          도착 노드 (Target)
                        </span>
                        <strong className="text-stone-900 text-sm font-serif">
                          {inspector.toLabel}
                        </strong>
                        {inspector.toGroup && (
                          <span className="text-[11px] text-stone-500 font-mono ml-1.5">
                            ({inspector.toGroup})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CSV Importer & Cypher Box */}
            <div className="bg-stone-50 border border-stone-300 rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-teal-700" />
                  <span>외부 CSV 데이터 주입기</span>
                </h3>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="text-[11px] font-mono text-stone-600 hover:text-[#8B1E1E] inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <Download className="w-3 h-3" />
                  <span>샘플 CSV</span>
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                <code className="font-mono text-[#8B1E1E]">nodes.csv</code> 또는{' '}
                <code className="font-mono text-[#8B1E1E]">edges.csv</code>를 업로드하여 그래프에 실시간 병합합니다.
              </p>

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`block w-full border border-dashed rounded-sm p-3 text-center cursor-pointer transition-colors ${
                  isDragOver
                    ? 'border-[#8B1E1E] bg-red-50/40'
                    : 'border-stone-400 bg-white hover:border-[#8B1E1E]'
                }`}
              >
                <Upload className="w-4 h-4 text-stone-500 mx-auto mb-1" />
                <span className="text-xs font-medium text-stone-700 block">
                  CSV 파일 선택 또는 드래그
                </span>
                <span className="text-[11px] text-stone-500 font-mono block">
                  Node / Edge CSV 자동 파싱
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {csvNotice && (
                <div
                  role="status"
                  className={`text-xs px-3 py-2 rounded-sm border ${
                    csvNotice.type === 'success'
                      ? 'bg-teal-50 border-teal-200 text-teal-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {csvNotice.message}
                </div>
              )}

              {/* Cypher Query Snippet */}
              <div className="bg-stone-900 text-stone-200 p-3 rounded-sm text-[11px] font-mono">
                <div className="text-stone-400 text-[10px] pb-1.5 border-b border-stone-800 mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {keyQuestionsData.map((kq, idx) => (
                      <button
                        key={kq.id}
                        type="button"
                        onClick={() => onCypherChange(kq.cypher)}
                        className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                          activeCypher === kq.cypher
                            ? 'bg-amber-200 text-stone-950 font-semibold'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        Q{idx + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCypher}
                    className="hover:text-amber-200 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    {copiedCypher ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-amber-200 overflow-x-auto custom-scroll leading-relaxed whitespace-pre-wrap break-all">
                  {activeCypher}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Knowledge Graph Q&A Chatbot */}
        <GraphChatbotPanel />
      </div>
    </section>
  );
}
