export interface CategoryNode {
  name: string;
  icon?: string;
  children: CategoryNode[];
}

export const CATEGORIES: CategoryNode[] = [
  {
    name: 'Programming',
    icon: '💻',
    children: [
      { name: 'KNOWLEDGE', icon: '⌘', children: [{ name: '자료구조', children: [] }, { name: '알고리즘', children: [] }, { name: '디자인 패턴', children: [] }, { name: 'WEB 지식', children: [] }, { name: 'HTTP 지식', children: [] }, { name: 'Network 지식', children: [] }, { name: 'CS 지식', children: [] }, { name: 'IT 용어 지식', children: [] }] },
      { name: 'LANGUAGE', icon: '⚙️', children: [{ name: 'C', children: [] }, { name: 'Java', children: [] }, { name: 'JavaScript', children: [] }, { name: 'TypeScript', children: [] }, { name: 'Python', children: [] }] },
      { name: 'FRAMEWORK', icon: '⚛️', children: [{ name: 'React', children: [] }, { name: 'Node.js', children: [] }, { name: 'Nest.js', children: [] }, { name: 'Next.js', children: [] }, { name: 'Spring', children: [] }] },
      { name: 'STYLE SHEET', icon: '🎨', children: [{ name: 'CSS', children: [] }, { name: 'Sass', children: [] }, { name: 'Bootstrap', children: [] }] },
    ]
  },
  {
    name: 'DevOps',
    icon: '🚀',
    children: [
      { name: 'OS', icon: '❖', children: [{ name: 'Window', children: [] }, { name: 'Linux', children: [] }] },
      { name: 'SERVER', icon: '⚡', children: [{ name: 'Apache', children: [] }, { name: 'Tomcat', children: [] }, { name: 'Jetty', children: [] }] },
      { name: 'CONTAINER', icon: '🐳', children: [{ name: 'Docker', children: [] }] },
      { name: 'CLOUD', icon: '☁️', children: [{ name: 'AWS', children: [] }, { name: 'MLOps', children: [] }] },
      { name: 'MANAGEMENT', icon: '♦', children: [{ name: 'GIT', children: [] }, { name: 'Github', children: [] }, { name: 'Jenkins', children: [] }, { name: 'CI/CD', children: [] }] },
      { name: 'DBMS', icon: '🗄️', children: [{ name: '데이터베이스 이론', children: [] }, { name: 'MySQL', children: [] }, { name: 'MongoDB', children: [] }, { name: 'Redis', children: [] }] },
    ]
  },
  {
    name: 'DevKit',
    icon: '🛠️',
    children: [
      { name: 'MARK UP', icon: '🌐', children: [{ name: 'HTML', children: [] }, { name: 'Markdown', children: [] }] },
      { name: 'FILES', icon: '📄', children: [{ name: 'CSV', children: [] }, { name: 'XML', children: [] }, { name: 'JSON', children: [] }, { name: 'YAML', children: [] }] },
      { name: 'TESTING', icon: '🧪', children: [{ name: 'SW 테스팅 이론', children: [] }, { name: 'Cypress', children: [] }, { name: 'PICT', children: [] }, { name: 'Selenium', children: [] }, { name: 'Postman', children: [] }, { name: 'JEST', children: [] }, { name: 'Artillery', children: [] }, { name: 'Pywinauto', children: [] }] },
      { name: 'EDITOR', icon: '💻', children: [{ name: 'VSCode', children: [] }, { name: 'IntelliJ', children: [] }] },
    ]
  }
];

export function getLeafCategories(nodeName: string): string[] {
  const leaves: string[] = [];
  
  let targetNode: CategoryNode | null = null;
  const findNode = (nodes: CategoryNode[]) => {
    for (const n of nodes) {
      if (n.name === nodeName) {
        targetNode = n;
        return;
      }
      if (n.children.length > 0) findNode(n.children);
    }
  };
  findNode(CATEGORIES);

  if (!targetNode) return [nodeName];

  const collectLeaves = (n: CategoryNode) => {
    if (n.children.length === 0) {
      leaves.push(n.name);
    } else {
      n.children.forEach(collectLeaves);
    }
  };
  collectLeaves(targetNode);
  
  return leaves.length > 0 ? leaves : [nodeName];
}
