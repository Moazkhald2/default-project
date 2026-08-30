// graph.ts — lightweight query layer for data/math_graph.json (Annatar extract->resolve->assemble->query)
export type GraphNode = {
  id: string;
  topic: string;
  grade: string;
  prereqs: string[];
  count: number;
  sources: string[];
  fullText?: string;
};
export type GraphEdge = { from: string; to: string; label: string };
export type MathGraph = {
  meta: { generated: string; stages: string; curriculumOutcomes?: number; source?: string; bankTopics?: number };
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export function getPrereqs(graph: MathGraph, topic: string, grade = "10"): string[] {
  const node = graph.nodes.find((n) => n.topic === topic && n.grade === grade);
  return node?.prereqs ?? [];
}

export function topologicalSort(graph: MathGraph): string[] {
  const visited = new Set<string>();
  const result: string[] = [];
  const adj = new Map<string, string[]>();
  for (const e of graph.edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push(e.to);
  }
  function dfs(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    for (const nxt of adj.get(id) ?? []) dfs(nxt);
    result.push(id);
  }
  for (const n of graph.nodes) dfs(n.id);
  return result.reverse();
}

export function canAttempt(graph: MathGraph, topic: string, completedTopics: Set<string>): boolean {
  const prereqs = getPrereqs(graph, topic);
  // prereqs are ids like "pythagorean-theorem:10" -> check topic part
  return prereqs.every((p) => completedTopics.has(p.split(":")[0]));
}
