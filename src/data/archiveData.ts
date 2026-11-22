export type NodeGroup = '인물' | '사조' | '저서' | '개념';

export interface BookItem {
  title: string;
  orig: string;
}

export interface ThinkerImageMeta {
  imageUrl: string;
  caption: string;
  sourceLabel: string;
  sourceUrl: string;
  googleSearchUrl: string;
  cautionNote?: string;
}

export interface Thinker {
  id: string;
  name: string;
  originalName: string;
  role: string;
  era: string;
  school: string;
  bio: string;
  books: BookItem[];
  concepts: string[];
  lineage: string;
  isHub?: boolean;
}

export interface GraphNodeData {
  id: string;
  label: string;
  group: NodeGroup;
  shape: 'circularImage' | 'dot' | 'diamond' | 'box' | 'ellipse';
  image?: string;
  brokenImage?: string;
  borderWidth?: number;
  size?: number;
  color?: string | { border?: string; background?: string; highlight?: { border?: string; background?: string } };
  font?: {
    color?: string;
    size?: number;
    strokeWidth?: number;
    strokeColor?: string;
  };
  hidden?: boolean;
}

const PORTRAIT_FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="#1C1917"/><circle cx="64" cy="48" r="22" fill="#D6CEBE"/><path d="M26 116c4-22 20-34 38-34s34 12 38 34" fill="#D6CEBE"/></svg>'
  );

export const thinkerPortraits: Record<string, ThinkerImageMeta> = {
  p_hegel: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Hegel_portrait_by_Schlesinger_1831.jpg',
    caption: '1831년 초상화 · Jakob Schlesinger · 퍼블릭 도메인',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hegel_portrait_by_Schlesinger_1831.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Hegel+Jakob+Schlesinger+1831',
  },
  p_feuerbach: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Ludwig_feuerbach.jpg',
    caption: '1866년경 · 촬영자 미상 · Heimatmuseum Bad Goisern · 퍼블릭 도메인',
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ludwig_feuerbach.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Ludwig+Feuerbach+Fotografie+1866',
  },
  p_marx: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Karl_marx_nypl.jpg',
    caption: '1875년경 · John Jabez Edwin Mayall 촬영, Karl Pinkau 복제 · 뉴욕공립도서관 소장 · 퍼블릭 도메인',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Karl_marx_nypl.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Karl+Marx+Mayall+1875+NYPL',
  },
  p_engels: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Friedrich_Engels_portrait.jpg',
    caption: '1877년 5월 · William Hall 촬영 · 퍼블릭 도메인',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Friedrich_Engels_portrait.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Friedrich+Engels+William+Hall+1877',
  },
  p_lukacs: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Luk%C3%A1cs_Gy%C3%B6rgy.jpg',
    caption: '1952년 7월 3일 · Bundesarchiv, Bild 183-15304-0097 / Horst Sturm · CC BY-SA 3.0 DE',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Luk%C3%A1cs_Gy%C3%B6rgy.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Gyorgy+Lukacs+Horst+Sturm+1952',
  },
  p_gramsci: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Gramsci_1922.jpg',
    caption: '1922년 · 촬영자 미상 · 퍼블릭 도메인',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gramsci_1922.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Antonio+Gramsci+1922+portrait',
  },
  p_benjamin: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Walter_Benjamin_vers_1928.jpg',
    caption: '1928년 증명사진 · 촬영자 미상 · 베를린 예술아카데미 발터 벤야민 아카이브 · 퍼블릭 도메인',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Walter_Benjamin_vers_1928.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Walter+Benjamin+1928+Passfoto',
  },
  p_horkheimer: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Max_Horkheimer.jpg',
    caption: '1964년 4월 · Jeremy J. Shapiro 촬영 · 원본에서 인물 부분 발췌 · CC BY-SA 3.0',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Max_Horkheimer.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Max+Horkheimer+Jeremy+Shapiro+1964',
  },
  p_adorno: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Theodor_W._Adorno.jpg',
    caption: '1964년 · Jeremy J. Shapiro 촬영 · 호르크하이머와 함께 나온 사진에서 발췌 · CC BY-SA 3.0',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Theodor_W._Adorno.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Theodor+Adorno+Jeremy+Shapiro+1964',
  },
  p_althusser: {
    imageUrl:
      'https://www.imec-archives.com/media/pages/matieres-premieres/papiers/althusser/sur-une-photo-de-louis-althusser/ca41071609-1743505929/alt_15482_1_20110225_155911_f-900x-q80.jpg',
    caption: '1970년경 파리 고등사범학교 연구실 · Archives Louis Althusser / Imec, © Keystone',
    sourceLabel: 'imec-archives.com',
    sourceUrl:
      'https://www.imec-archives.com/matieres-premieres/papiers/althusser/sur-une-photo-de-louis-althusser',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Louis+Althusser+bureau+IMEC+Keystone',
    cautionNote: '공개 게시 허락 확인 전에는 IMEC 아카이브 출처 페이지를 함께 연결 표기합니다.',
  },
  p_habermas: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/JuergenHabermas.jpg',
    caption: '뮌헨 철학대학 토론 현장 · Wolfram Huke 촬영 · CC BY-SA 3.0',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:JuergenHabermas.jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Jurgen+Habermas+Wolfram+Huke+Munich',
  },
  p_bourdieu: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Pierre_Bourdieu_%281%29.jpg',
    caption: '1996년 · Bernard Lambert 촬영 · CC BY-SA 4.0',
    sourceLabel: 'commons.wikimedia.org',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pierre_Bourdieu_(1).jpg',
    googleSearchUrl: 'https://www.google.com/search?tbm=isch&q=Pierre+Bourdieu+Bernard+Lambert+1996',
  },
};

export interface GraphEdgeData {
  id?: string;
  from: string;
  to: string;
  label: string;
  arrows?: string;
  dashes?: boolean;
  color?: string | { color: string };
  hidden?: boolean;
}

export interface KeyQuestionItem {
  id: string;
  number: string;
  category: string;
  title: string;
  highlights: { label: string; detail: string }[];
  ontologies: string[];
  queryHint: string;
  focusNodeId: string;
  cypher: string;
  isFeatured?: boolean;
}

export interface TeamMember {
  initial: string;
  name: string;
  role: string;
  department: string;
  track: string;
  description: string;
  isLeader?: boolean;
}

export const thinkersData: Thinker[] = [
  {
    id: 'p_hegel',
    name: 'G. W. F. 헤겔',
    originalName: 'Georg Wilhelm Friedrich Hegel (1770–1831)',
    role: '독일 관념론의 집대성자',
    era: '18세기 후반 ~ 19세기 초',
    school: '독일 관념론',
    bio: "정신현상학과 변증법(정-반-합) 체계를 구축하여 역사를 '절대정신'이 자유를 실현해 나가는 과정으로 파악했습니다. 마르크스는 헤겔의 관념론적 변증법을 전도(Umstülpung)하여 유물변증법으로 재구성했습니다.",
    books: [
      { title: '《정신현상학》', orig: 'Phänomenologie des Geistes (1807)' },
      { title: '《법철학 강요》', orig: 'Grundlinien der Philosophie des Rechts (1820)' },
    ],
    concepts: ['변증법', '절대정신', '자기의식', '소외 (관념적)'],
    lineage: "마르크스가 변증법을 유물론적으로 전도 수용 / 청년헤겔학파에 지대한 영향",
  },
  {
    id: 'p_feuerbach',
    name: '루드비히 포이어바흐',
    originalName: 'Ludwig Andreas Feuerbach (1804–1872)',
    role: '청년헤겔학파 및 감각적 유물론자',
    era: '19세기 전반',
    school: '감각적 유물론',
    bio: "신은 인간의 본질(유적존재)이 투사되어 자기 소외된 환상이라고 비판하며 헤겔의 관념론을 거부하고 감각적 유물론을 주창했습니다. 마르크스는 《포이어바흐에 관한 테제》에서 그의 직관적 유물론을 실천적 유물론으로 비판 승계했습니다.",
    books: [{ title: '《기독교의 본질》', orig: 'Das Wesen des Christentums (1841)' }],
    concepts: ['유적존재 (Gattungswesen)', '종교적 소외', '인간학적 유물론'],
    lineage: "마르크스에게 '유적존재' 및 '소외' 개념 영감 제공, 관념론 탈피의 디딤돌",
  },
  {
    id: 'p_marx',
    name: '카를 마르크스',
    originalName: 'Karl Marx (1818–1883)',
    role: '역사적 유물론 및 자본주의 체계 비판의 축(Hub)',
    era: '19세기 중후반',
    school: '마르크스주의 (지적 허브)',
    isHub: true,
    bio: "사회를 관념이 아니라 '물질적 생산양식'에 의해 추동된다고 본 역사적 유물론을 정립했습니다. 생산수단의 사적 소유로 인한 노동 소외와 자본가의 잉여가치 착취 메커니즘을 규명하며 20세기 사회학 이론 전반의 불가결한 비판적 준거점이 되었습니다.",
    books: [
      { title: '《1844년 경제학 철학 초고》', orig: 'Ökonomisch-philosophische Manuskripte (1844)' },
      { title: '《독일 이데올로기》', orig: 'Die deutsche Ideologie (1845–46)' },
      { title: '《공산당 선언》', orig: 'Manifest der Kommunistischen Partei (1848)' },
      { title: '《자본론》', orig: 'Das Kapital (1867, 1885, 1894)' },
    ],
    concepts: ['역사적 유물론', '소외 (노동)', '잉여가치', '상부구조/하부구조', '상품 물신성', '계급의식'],
    lineage: '본 지식그래프의 중심 축. 20세기 프랑크푸르트학파, 구조주의, 문화사회학으로 다각도 분기',
  },
  {
    id: 'p_engels',
    name: '프리드리히 엥겔스',
    originalName: 'Friedrich Engels (1820–1895)',
    role: '마르크스의 평생의 지적 동료이자 조력자',
    era: '19세기 중후반',
    school: '정통 마르크스주의',
    bio: '마르크스와 함께 《독일 이데올로기》와 《공산당 선언》을 공저하고, 마르크스 사후 미완이었던 《자본론》 제2권과 3권을 편집·출간했습니다. 사회주의를 공상에서 과학으로 체계화하고 자연변증법을 시도했습니다.',
    books: [
      { title: '《유토피아에서 과학으로의 사회주의 발전》', orig: 'Die Entwicklung des Sozialismus von der Utopie zur Wissenschaft (1880)' },
      { title: '《공산당 선언》(공저)', orig: 'Manifest der Kommunistischen Partei (1848)' },
    ],
    concepts: ['변증법적 유물론', '과학적 사회주의', '국가소멸론'],
    lineage: '마르크스와 평생의 지적·재정적 협력 및 공저 관계',
  },
  {
    id: 'p_horkheimer',
    name: '막스 호르크하이머',
    originalName: 'Max Horkheimer (1895–1973)',
    role: '프랑크푸르트 사회연구소 소장 및 비판이론 창도자',
    era: '20세기 중반',
    school: '프랑크푸르트학파 (비판이론)',
    bio: "실증주의적 '전통이론'과 대비되는 사회 변혁 지향의 '비판이론'을 정식화했습니다. 아도르노와 《계몽의 변증법》을 공저하며 근대 도구적 이성이 지배와 야만으로 전도되는 메커니즘을 규명했습니다.",
    books: [
      { title: '《전통이론과 비판이론》', orig: 'Traditionelle und kritische Theorie (1937)' },
      { title: '《계몽의 변증법》(공저)', orig: 'Dialektik der Aufklärung (1947)' },
      { title: '《도구적 이성 비판》', orig: 'Zur Kritik der instrumentellen Vernunft (1947)' },
    ],
    concepts: ['비판이론 vs 전통이론', '도구적 이성 비판', '권위와 가족'],
    lineage: '마르크스의 이데올로기 비판을 학제적 사회연구 및 도구적 이성 비판으로 재정립',
  },
  {
    id: 'p_adorno',
    name: '테오도어 아도르노',
    originalName: 'Theodor W. Adorno (1903–1969)',
    role: '프랑크푸르트학파 1세대 대표 비판이론가',
    era: '20세기 중반',
    school: '프랑크푸르트학파 (비판이론)',
    bio: "호르크하이머와 함께 계몽이 도구적 이성으로 변질되어 파시즘과 대량 살육의 야만을 낳았다고 비판했습니다. 문화산업을 통해 대중의 비판적 의식이 마비되는 현실을 분석하고 헤겔의 긍정적 종합을 반대하는 '부정변증법'을 주창했습니다.",
    books: [
      { title: '《계몽의 변증법》(공저)', orig: 'Dialektik der Aufklärung (1947)' },
      { title: '《부정변증법》', orig: 'Negative Dialektik (1966)' },
      { title: '《권위주의적 인간형》', orig: 'The Authoritarian Personality (1950)' },
    ],
    concepts: ['도구적 이성 비판', '문화산업 (Culture Industry)', '부정변증법', '권위주의적 인간형'],
    lineage: '마르크스의 상품물신성·루카치 물화론을 수용하여 대중문화와 파시즘 분석으로 변용',
  },
  {
    id: 'p_benjamin',
    name: '발터 벤야민',
    originalName: 'Walter Benjamin (1892–1940)',
    role: '비판이론 문화철학자이자 문예비평가',
    era: '20세기 전반',
    school: '초기 비판이론 & 마르크스주의 미학',
    bio: "기술 복제 기술의 발달로 예술 작품 고유의 '아우라(Aura)'가 상실되는 현상을 분석하고, 선형적 진보주의 역사관을 파기하며 억압받은 자들의 역사를 복원하는 '구원적 비판'을 제시했습니다.",
    books: [
      { title: '《기술복제시대의 예술작품》', orig: 'Das Kunstwerk im Zeitalter seiner technischen Reproduzierbarkeit (1936)' },
      { title: '《역사의 개념에 대하여》', orig: 'Über den Begriff der Geschichte (1940)' },
    ],
    concepts: ['아우라의 상실', '기술복제', '구원적 비판', '역사유물론적 파편'],
    lineage: '마르크스의 물질적 생산력 분석을 예술 및 대중지각 미학으로 확장',
  },
  {
    id: 'p_althusser',
    name: '루이 알튀세르',
    originalName: 'Louis Althusser (1918–1990)',
    role: '프랑스 구조주의 마르크스주의 대표자',
    era: '20세기 후반',
    school: '구조주의 마르크스주의',
    bio: "청년 마르크스의 휴머니즘과 후기 마르크스의 과학 사이에 '인식론적 단절'이 존재한다고 주장했습니다. 국가는 억압적 국가기구(RSA)뿐만 아니라 학교·언론·종교 등 이데올로기적 국가기구(ISA)를 통해 개인을 주체로 '호명'하여 지배 관계를 재생산한다고 분석했습니다.",
    books: [
      { title: '《마르크스를 위하여》', orig: 'Pour Marx (1965)' },
      { title: '《자본론을 읽는다》', orig: 'Lire le Capital (1965)' },
      { title: '《이데올로기와 이데올로기적 국가기구》', orig: "Idéologie et appareils idéologiques d'État (1970)" },
    ],
    concepts: ['이데올로기적 국가기구(ISA)', '호명(Interpellation)', '과잉결정', '인식론적 단절'],
    lineage: '마르크스의 상부구조 이론을 구조주의 언어학 및 정신분석학과 결합하여 비판적 재구성',
  },
  {
    id: 'p_habermas',
    name: '위르겐 하버마스',
    originalName: 'Jürgen Habermas (1929–현재)',
    role: '프랑크푸르트학파 2세대 거두 및 사회철학자',
    era: '20세기 후반 ~ 현재',
    school: '비판적 사회이론 / 소통이론',
    bio: "초기 비판이론가들의 비관주의(도구적 이성의 완전한 지배)를 비판하며, 인간 이성에는 합의를 지향하는 '의사소통적 합리성'이 내재해 있음을 역설했습니다. 체계(돈과 권력)가 생활세계를 식민화하는 것을 막는 공론장의 활성화를 주장했습니다.",
    books: [
      { title: '《공론장의 구조변동》', orig: 'Strukturwandel der Öffentlichkeit (1962)' },
      { title: '《의사소통행위론》', orig: 'Theorie des kommunikativen Handelns (1981)' },
    ],
    concepts: ['공론장', '의사소통행위', '생활세계의 식민화', '체계와 생활세계', '이상적 담화상황'],
    lineage: "마르크스의 노동 중심 패러다임을 '상호작용(소통행위)' 패러다임으로 전환",
  },
  {
    id: 'p_bourdieu',
    name: '피에르 부르디외',
    originalName: 'Pierre Bourdieu (1930–2002)',
    role: '현대 프랑스 비판적 문화사회학 거장',
    era: '20세기 후반',
    school: '비판적 문화사회학 / 실천이론',
    bio: "마르크스의 경제적 자본 개념을 문화자본, 사회적 자본, 상징자본으로 대폭 확장했습니다. 계급은 단순한 경제 소유만이 아니라 취향과 신체화된 성향체계인 '아비투스(Habitus)'를 통해 은밀하고 합법적인 방식으로 재생산된다고 폭로했습니다.",
    books: [
      { title: '《재생산》(공저)', orig: 'La Reproduction (1970)' },
      { title: '《구별짓기》', orig: 'La Distinction (1979)' },
      { title: '《실천감각》', orig: 'Le Sens pratique (1980)' },
    ],
    concepts: ['아비투스 (Habitus)', '문화자본 (Cultural Capital)', '상징폭력', '장 (Field)'],
    lineage: '마르크스의 자본·계급론을 문화적 구별짓기 및 상징투쟁의 장으로 변용/확장',
  },
];

export const keyQuestionsData: KeyQuestionItem[] = [
  {
    id: 'kq1',
    number: 'Key Question 01',
    category: 'Lineage Paths',
    title: '마르크스의 지적 유산은 20세기 사회학 이론에 어떤 계보적 경로로 계승되고 변용되었는가?',
    highlights: [
      {
        label: '단순 승계 vs 비판적 수정',
        detail: '경제결정론을 탈피하고 문화·의식·언어·국가기구 분석으로 확장된 경로 추적.',
      },
    ],
    ontologies: ['비판적 승계', '옹호적 승계', '개념 변용/확장'],
    queryHint: 'Multi-hop (인물 → 인물 → 개념)',
    focusNodeId: 'p_adorno',
    cypher: `MATCH path = (later:Person)-[:CRITICAL_SUCCESSION|REINTERPRETS*1..3]->(hub:Person {id: 'p_marx'})
RETURN path LIMIT 25`,
  },
  {
    id: 'kq2',
    number: 'Key Question 02',
    category: 'N:M Topology',
    title: "사상가 - 쟁점 - 저서의 다대다 연결망에서 마르크스는 어떤 '지적 허브' 역할을 하는가?",
    highlights: [
      {
        label: '중심성 분석(Degree/Betweenness)',
        detail: '마르크스의 초기 텍스트(《1844 초고》)와 후기 텍스트(《자본론》)가 분기시킨 현대 이론들의 교차점 측정.',
      },
    ],
    ontologies: ['저술/집필', '개념 제기', '개념 비판'],
    queryHint: 'Network Centrality',
    focusNodeId: 'p_marx',
    isFeatured: true,
    cypher: `MATCH (p:Person {name: 'Karl Marx'})-[r:CRITICAL_SUCCESSION|REINTERPRETS|WROTE]-(target)
RETURN p, r, target LIMIT 25`,
  },
  {
    id: 'kq3',
    number: 'Key Question 03',
    category: 'German Tradition',
    title: '20세기 사회이론 형성과 사회학 성립에 있어 독일 지적 전통은 어떻게 전유되고 변용되었는가?',
    highlights: [
      {
        label: '변증법적 전도와 현대화',
        detail: '헤겔의 관념론적 변증법이 마르크스의 유물변증법으로 전도된 후, 아도르노의 부정변증법 및 하버마스의 소통이론으로 계승된 양상 규명.',
      },
    ],
    ontologies: ['참여', '사조 비판', '개념 포함'],
    queryHint: 'School / Tradition Trace',
    focusNodeId: 'p_hegel',
    cypher: `MATCH (p:Person)-[:BELONGS_TO]->(s:School)
WHERE s.name IN ['독일 관념론', '프랑크푸르트학파']
RETURN p, s`,
  },
];

export const lineageStages = [
  {
    stage: 'Stage 01 · 18세기 말 ~ 19세기 초',
    title: '독일 관념론 & 유물론 전회',
    description: '헤겔의 변증법과 포이어바흐의 감각적 유물론·종교적 소외 비판.',
    figures: '헤겔, 포이어바흐',
    accent: 'border-stone-500',
    isHub: false,
  },
  {
    stage: 'Stage 02 · 지적 허브 (Hub)',
    title: '역사적 유물론 & 자본주의 분석',
    description: "관념의 자리에 '생산양식' 배치. 노동 소외와 잉여가치 착취 메커니즘 해명.",
    figures: '마르크스, 엥겔스',
    accent: 'border-[#8B1E1E]',
    isHub: true,
  },
  {
    stage: 'Stage 03 · 20세기 전반',
    title: '서구 마르크스주의 & 비판이론',
    description: '루카치의 물화론, 그람시의 헤게모니, 프랑크푸르트학파의 도구적 이성 비판.',
    figures: '루카치, 그람시, 아도르노, 벤야민',
    accent: 'border-[#B48448]',
    isHub: false,
  },
  {
    stage: 'Stage 04 · 20세기 후반',
    title: '구조주의 & 현대 비판사회학',
    description: '알튀세르의 국가기구론, 부르디외의 문화자본·아비투스, 하버마스의 공론장·의사소통행위론.',
    figures: '알튀세르, 하버마스, 부르디외',
    accent: 'border-[#0F766E]',
    isHub: false,
  },
];

export const initialGraphNodes: GraphNodeData[] = [
  // 인물 (12명 — 초상화 원형 노드)
  {
    id: 'p_marx',
    label: '칼 마르크스\n(Karl Marx)',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_marx.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 3.5,
    size: 40,
    color: { border: '#8B1E1E', background: '#FAF8F5', highlight: { border: '#1C1917', background: '#FEE2E2' } },
    font: { color: '#1c1917', size: 13, strokeWidth: 3, strokeColor: '#FAF8F5' },
  },
  {
    id: 'p_hegel',
    label: 'G. W. F. 헤겔',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_hegel.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 26,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_feuerbach',
    label: '루드비히 포이어바흐',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_feuerbach.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 25,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_engels',
    label: '프리드리히 엥겔스',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_engels.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 27,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_lukacs',
    label: '게오르기 루카치',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_lukacs.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 25,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_gramsci',
    label: '안토니오 그람시',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_gramsci.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 25,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_horkheimer',
    label: '막스 호르크하이머',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_horkheimer.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 26,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_adorno',
    label: '테오도어 아도르노',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_adorno.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 26,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_benjamin',
    label: '발터 벤야민',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_benjamin.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 25,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_althusser',
    label: '루이 알튀세르',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_althusser.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 26,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_habermas',
    label: '위르겐 하버마스',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_habermas.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 27,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },
  {
    id: 'p_bourdieu',
    label: '피에르 부르디외',
    group: '인물',
    shape: 'circularImage',
    image: thinkerPortraits.p_bourdieu.imageUrl,
    brokenImage: PORTRAIT_FALLBACK_SVG,
    borderWidth: 2.5,
    size: 27,
    color: { border: '#8B1E1E', background: '#FAF8F5' },
  },

  // 사조
  { id: 's_idealism', label: '독일 관념론', group: '사조', shape: 'diamond', size: 24, color: '#4338CA' },
  { id: 's_orthodox', label: '정통 마르크스주의', group: '사조', shape: 'diamond', size: 22, color: '#4338CA' },
  { id: 's_frankfurt', label: '프랑크푸르트학파\n(비판이론)', group: '사조', shape: 'diamond', size: 28, color: '#4338CA' },
  { id: 's_struct_marx', label: '구조주의 마르크스주의', group: '사조', shape: 'diamond', size: 22, color: '#4338CA' },
  { id: 's_culture_soc', label: '비판적 문화사회학', group: '사조', shape: 'diamond', size: 22, color: '#4338CA' },

  // 저서
  { id: 'b_phenomenology', label: '《정신현상학》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_christianity', label: '《기독교의 본질》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_1844', label: '《1844년 경제학 철학 초고》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_kapital', label: '《자본론》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_manifesto', label: '《공산당 선언》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_ideology', label: '《독일 이데올로기》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_history_class', label: '《역사와 계급의식》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_prison', label: '《옥중수고》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_dialectic_enlight', label: '《계몽의 변증법》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_distinction', label: '《구별짓기》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_comm_action', label: '《의사소통행위론》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_isa', label: '《이데올로기와 ISA》', group: '저서', shape: 'box', color: '#B48448' },
  { id: 'b_artwork', label: '《기술복제시대의 예술작품》', group: '저서', shape: 'box', color: '#B48448' },

  // 개념
  { id: 'c_dialectic', label: '변증법', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_mat_dialectic', label: '역사적 유물론', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_alienation', label: '노동 소외', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_surplus', label: '잉여가치', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_species', label: '유적존재', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_reification', label: '물화 (Verdinglichung)', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_hegemony', label: '헤게모니 (진지전)', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_inst_reason', label: '도구적 이성', group: '개념', shape: 'ellipse', size: 18, color: '#0F766E' },
  { id: 'c_culture_ind', label: '문화산업', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_aura', label: '아우라의 상실', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_public_sphere', label: '공론장', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_habitus', label: '아비투스', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_cult_capital', label: '문화자본', group: '개념', shape: 'ellipse', color: '#0F766E' },
  { id: 'c_isa_rsa', label: '이데올로기적 국가기구', group: '개념', shape: 'ellipse', color: '#0F766E' },
];

export const initialGraphEdges: GraphEdgeData[] = [
  // 인물-인물
  { id: 'e1', from: 'p_marx', to: 'p_hegel', label: '비판적 전도', arrows: 'to', dashes: true, color: { color: '#8B1E1E' } },
  { id: 'e2', from: 'p_marx', to: 'p_feuerbach', label: '실천적 비판 승계', arrows: 'to', dashes: true, color: { color: '#8B1E1E' } },
  { id: 'e3', from: 'p_engels', to: 'p_marx', label: '협력 및 공저', arrows: 'to;from', color: { color: '#44403C' } },
  { id: 'e4', from: 'p_lukacs', to: 'p_marx', label: '철학적 재해석', arrows: 'to', color: { color: '#8B1E1E' } },
  { id: 'e5', from: 'p_gramsci', to: 'p_marx', label: '상부구조 확장', arrows: 'to', color: { color: '#8B1E1E' } },
  { id: 'e6a', from: 'p_horkheimer', to: 'p_marx', label: '비판이론 계승', arrows: 'to', color: { color: '#8B1E1E' } },
  { id: 'e6b', from: 'p_horkheimer', to: 'p_adorno', label: '공동 연구', arrows: 'to;from', color: { color: '#44403C' } },
  { id: 'e6', from: 'p_adorno', to: 'p_marx', label: '비판적 승계', arrows: 'to', color: { color: '#8B1E1E' } },
  { id: 'e7', from: 'p_benjamin', to: 'p_marx', label: '미학적 확장', arrows: 'to', color: { color: '#8B1E1E' } },
  { id: 'e8', from: 'p_althusser', to: 'p_marx', label: '구조주의적 재독해', arrows: 'to', color: '#8B1E1E' },
  { id: 'e9', from: 'p_habermas', to: 'p_adorno', label: '패러다임 전환 비판', arrows: 'to', dashes: true, color: { color: '#8B1E1E' } },
  { id: 'e10', from: 'p_bourdieu', to: 'p_marx', label: '자본 개념 확장', arrows: 'to', color: { color: '#8B1E1E' } },

  // 인물-사조
  { id: 'e11', from: 'p_hegel', to: 's_idealism', label: '집대성', arrows: 'to' },
  { id: 'e12', from: 'p_engels', to: 's_orthodox', label: '체계화', arrows: 'to' },
  { id: 'e13a', from: 'p_horkheimer', to: 's_frankfurt', label: '창도·주도', arrows: 'to' },
  { id: 'e13', from: 'p_adorno', to: 's_frankfurt', label: '주도', arrows: 'to' },
  { id: 'e14', from: 'p_benjamin', to: 's_frankfurt', label: '비판미학 기여', arrows: 'to' },
  { id: 'e15', from: 'p_habermas', to: 's_frankfurt', label: '2세대 계승', arrows: 'to' },
  { id: 'e16', from: 'p_althusser', to: 's_struct_marx', label: '정립', arrows: 'to' },
  { id: 'e17', from: 'p_bourdieu', to: 's_culture_soc', label: '정립', arrows: 'to' },

  // 인물-저서 (저술)
  { id: 'e18a', from: 'p_hegel', to: 'b_phenomenology', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e18b', from: 'p_feuerbach', to: 'b_christianity', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e18c', from: 'p_marx', to: 'b_1844', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e18', from: 'p_marx', to: 'b_kapital', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e19', from: 'p_marx', to: 'b_manifesto', label: '공저', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e20', from: 'p_engels', to: 'b_manifesto', label: '공저', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e21', from: 'p_marx', to: 'b_ideology', label: '공저', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e21b', from: 'p_engels', to: 'b_ideology', label: '공저', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e21c', from: 'p_lukacs', to: 'b_history_class', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e21d', from: 'p_gramsci', to: 'b_prison', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e22a', from: 'p_horkheimer', to: 'b_dialectic_enlight', label: '공저', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e22', from: 'p_adorno', to: 'b_dialectic_enlight', label: '공저', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e23', from: 'p_benjamin', to: 'b_artwork', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e24', from: 'p_habermas', to: 'b_comm_action', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e25', from: 'p_althusser', to: 'b_isa', label: '집필', arrows: 'to', color: { color: '#B48448' } },
  { id: 'e26', from: 'p_bourdieu', to: 'b_distinction', label: '집필', arrows: 'to', color: { color: '#B48448' } },

  // 저서-개념
  { id: 'e27a', from: 'b_phenomenology', to: 'c_dialectic', label: '개념 정립', arrows: 'to' },
  { id: 'e27b', from: 'b_christianity', to: 'c_species', label: '개념 제기', arrows: 'to' },
  { id: 'e27c', from: 'b_1844', to: 'c_alienation', label: '개념 정립', arrows: 'to' },
  { id: 'e27', from: 'b_kapital', to: 'c_surplus', label: '개념 포함', arrows: 'to' },
  { id: 'e28', from: 'b_kapital', to: 'c_mat_dialectic', label: '이론 적용', arrows: 'to' },
  { id: 'e28b', from: 'b_manifesto', to: 'c_mat_dialectic', label: '계급론 적용', arrows: 'to' },
  { id: 'e29', from: 'b_ideology', to: 'c_mat_dialectic', label: '개념 정립', arrows: 'to' },
  { id: 'e29b', from: 'b_history_class', to: 'c_reification', label: '개념 정립', arrows: 'to' },
  { id: 'e29c', from: 'b_prison', to: 'c_hegemony', label: '개념 정립', arrows: 'to' },
  { id: 'e30', from: 'b_dialectic_enlight', to: 'c_inst_reason', label: '비판 정립', arrows: 'to' },
  { id: 'e31', from: 'b_dialectic_enlight', to: 'c_culture_ind', label: '개념 제시', arrows: 'to' },
  { id: 'e32', from: 'b_artwork', to: 'c_aura', label: '개념 제시', arrows: 'to' },
  { id: 'e33', from: 'b_comm_action', to: 'c_public_sphere', label: '소통 합리화', arrows: 'to' },
  { id: 'e34', from: 'b_distinction', to: 'c_habitus', label: '실증 분석', arrows: 'to' },
  { id: 'e35', from: 'b_distinction', to: 'c_cult_capital', label: '구조 분석', arrows: 'to' },
  { id: 'e36', from: 'b_isa', to: 'c_isa_rsa', label: '이론화', arrows: 'to' },
  { id: 'e37', from: 'p_feuerbach', to: 'c_species', label: '개념 제기', arrows: 'to' },
  { id: 'e38', from: 'p_lukacs', to: 'c_reification', label: '이론화', arrows: 'to' },
  { id: 'e39', from: 'p_gramsci', to: 'c_hegemony', label: '이론화', arrows: 'to' },

  // 개념 간 변용
  { id: 'e40', from: 'c_species', to: 'c_alienation', label: '소외로의 전도', arrows: 'to', dashes: true },
  { id: 'e41', from: 'c_alienation', to: 'c_reification', label: '물화론으로 확장', arrows: 'to' },
  { id: 'e42', from: 'c_surplus', to: 'c_cult_capital', label: '문화자본으로 변용', arrows: 'to' },
];

export const teamMembers: TeamMember[] = [
  {
    initial: '강',
    name: '강수이',
    role: '팀장',
    department: '독어독문학과 · 기획 총괄',
    track: 'German Literature',
    description: '헤겔 및 마르크스 독일어 원전 개념 추출 및 번역어 대조. 데이터 온톨로지 구조 설계 및 기획서 총괄 집필.',
    isLeader: true,
  },
  {
    initial: '김',
    name: '김민식',
    role: '발표',
    department: '독어독문학과 · 지적 전통 연구',
    track: 'German Literature',
    description: '프랑크푸르트학파(아도르노, 벤야민)의 독일 철학적 수용사 분석. 데이터 검증 및 아카이브 발표 자료 제작.',
  },
  {
    initial: '윤',
    name: '윤지원',
    role: '발표',
    department: '사회학과 · 이론 맥락화',
    track: 'Sociology Major',
    description: '20세기 서구 마르크스주의 및 현대 사회이론(알튀세르, 부르디외, 하버마스) 쟁점 관계 구조화 및 사회학적 유효성 검증.',
  },
];

export const scheduleMilestones = [
  { weeks: '6주차 ~ 7주차', milestone: '기획 및 중간발표 (10.14)' },
  { weeks: '8주차', milestone: 'Neo4j 1차 데이터 입력' },
  { weeks: '9주차 ~ 10주차', milestone: 'Cypher 질의문 작성 및 시각화' },
  { weeks: '11주차 ~ 16주차', milestone: '데이터 정제, 포트폴리오 및 최종 보고' },
];

export interface EraTimelineItem {
  id: string;
  eraLabel: string;
  period: string;
  startYear: number;
  endYear: number;
  title: string;
  summary: string;
  barColor: string;
  isHub?: boolean;
  schools: { id: string; label: string }[];
  thinkers: { id: string; name: string; lifespan: string; focus: string; isHub?: boolean }[];
  keyConcepts: string[];
}

export const eraTimelineData: EraTimelineItem[] = [
  {
    id: 'era_1',
    eraLabel: '18세기 말 ~ 19세기 초',
    period: '1770 – 1872',
    startYear: 1770,
    endYear: 1872,
    title: '독일 관념론 & 감각적 유물론 전회',
    summary:
      '헤겔의 변증법적 정신철학에서 출발해 포이어바흐의 감각적·인간학적 유물론으로 전회하며 마르크스 사상의 철학적 토대를 형성한 시기.',
    barColor: '#57534E',
    schools: [{ id: 's_idealism', label: '독일 관념론' }],
    thinkers: [
      { id: 'p_hegel', name: 'G. W. F. 헤겔', lifespan: '1770–1831', focus: '변증법 · 절대정신' },
      { id: 'p_feuerbach', name: '루드비히 포이어바흐', lifespan: '1804–1872', focus: '유적존재 · 종교적 소외' },
    ],
    keyConcepts: ['변증법', '절대정신', '유적존재', '종교적 소외'],
  },
  {
    id: 'era_2',
    eraLabel: '19세기 중후반',
    period: '1818 – 1895',
    startYear: 1818,
    endYear: 1895,
    title: '역사적 유물론 & 자본주의 체계 비판 (Hub)',
    summary:
      '마르크스와 엥겔스가 독일 관념론을 유물론적으로 전도하여 생산양식·노동 소외·잉여가치 이론을 정립한 사상사의 중심 허브.',
    barColor: '#8B1E1E',
    isHub: true,
    schools: [{ id: 's_orthodox', label: '정통 마르크스주의' }],
    thinkers: [
      {
        id: 'p_marx',
        name: '카를 마르크스',
        lifespan: '1818–1883',
        focus: '역사적 유물론 · 잉여가치 · 노동 소외',
        isHub: true,
      },
      { id: 'p_engels', name: '프리드리히 엥겔스', lifespan: '1820–1895', focus: '변증법적 유물론 · 공산당 선언 공저' },
    ],
    keyConcepts: ['역사적 유물론', '노동 소외', '잉여가치', '상품 물신성'],
  },
  {
    id: 'era_3',
    eraLabel: '20세기 전반',
    period: '1885 – 1969',
    startYear: 1885,
    endYear: 1969,
    title: '서구 마르크스주의 & 초기 비판이론',
    summary:
      '경제결정론을 넘어 물화·헤게모니·문화산업·기술복제 미학 등 의식과 문화 영역으로 마르크스주의를 재구성한 시기.',
    barColor: '#B48448',
    schools: [{ id: 's_frankfurt', label: '프랑크푸르트학파 (비판이론)' }],
    thinkers: [
      { id: 'p_lukacs', name: '게오르기 루카치', lifespan: '1885–1971', focus: '물화론 · 계급의식' },
      { id: 'p_gramsci', name: '안토니오 그람시', lifespan: '1891–1937', focus: '헤게모니 · 진지전' },
      { id: 'p_benjamin', name: '발터 벤야민', lifespan: '1892–1940', focus: '아우라의 상실 · 기술복제' },
      { id: 'p_horkheimer', name: '막스 호르크하이머', lifespan: '1895–1973', focus: '비판이론 · 도구적 이성' },
      { id: 'p_adorno', name: '테오도어 아도르노', lifespan: '1903–1969', focus: '도구적 이성 · 문화산업' },
    ],
    keyConcepts: ['물화 (Verdinglichung)', '헤게모니', '도구적 이성', '문화산업', '아우라의 상실'],
  },
  {
    id: 'era_4',
    eraLabel: '20세기 후반 ~ 현재',
    period: '1918 – 현재',
    startYear: 1918,
    endYear: 2026,
    title: '구조주의 & 현대 비판사회학',
    summary:
      '국가기구와 이데올로기(알튀세르), 공론장과 의사소통행위(하버마스), 문화자본과 아비투스(부르디외)로 확장된 현대 사회이론.',
    barColor: '#0F766E',
    schools: [
      { id: 's_struct_marx', label: '구조주의 마르크스주의' },
      { id: 's_culture_soc', label: '비판적 문화사회학' },
      { id: 's_frankfurt', label: '프랑크푸르트학파 2세대' },
    ],
    thinkers: [
      { id: 'p_althusser', name: '루이 알튀세르', lifespan: '1918–1990', focus: '이데올로기적 국가기구(ISA) · 호명' },
      { id: 'p_habermas', name: '위르겐 하버마스', lifespan: '1929–현재', focus: '공론장 · 의사소통행위' },
      { id: 'p_bourdieu', name: '피에르 부르디외', lifespan: '1930–2002', focus: '아비투스 · 문화자본' },
    ],
    keyConcepts: ['이데올로기적 국가기구', '공론장', '아비투스', '문화자본'],
  },
];

