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
      { name: 'Mark Up', icon: '</>', children: [{ name: 'HTML', children: [] }, { name: 'MarkDown', children: [] }] },
      { name: 'Style Sheet', icon: '🎨', children: [{ name: 'CSS', children: [] }, { name: 'Sass', children: [] }, { name: 'Bootstrap5', children: [] }] },
      { name: 'Language', icon: '⚙️', children: [{ name: 'C', children: [] }, { name: 'Java', children: [] }, { name: 'JavaScript', children: [] }, { name: 'TypeScript', children: [] }, { name: 'Python', children: [] }] },
    ]
  },
  {
    name: 'DevOps',
    icon: '🚀',
    children: [
      { name: 'Linux', icon: '🐧', children: [] },
      { name: 'Docker', icon: '🐳', children: [] },
      { name: 'AWS', icon: '☁️', children: [] },
    ]
  },
  {
    name: 'DevKit',
    icon: '🛠️',
    children: [
      { name: 'Git', icon: '🌲', children: [] },
      { name: 'VSCode', icon: '📝', children: [] },
    ]
  }
];

export function getLeafCategories(nodeName: string): string[] {
  let leaves: string[] = [];
  
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
