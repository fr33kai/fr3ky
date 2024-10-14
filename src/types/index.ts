export interface KnowledgeBase {
  id: string;
  name: string;
  content: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  specialization: string;
  availableTools: string[]; // IDs of tools the agent can use
  execute: (input: string, tools: Tool[]) => Promise<string>;
}

export interface AIAssistant {
  knowledgeBases: KnowledgeBase[];
  tools: Tool[];
  agents: Agent[];
  learn: (input: string) => Promise<void>;
  executeTask: (task: string) => Promise<string>;
  generateAgent: (specialization: string) => Promise<Agent>;
}