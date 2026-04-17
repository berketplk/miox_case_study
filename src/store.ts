import { create } from 'zustand';
import type { AnalyzerResult, Step } from './types';

type NodeAIState = {
  explanation?: string;
  analyzerResult?: AnalyzerResult;
};

type ClaimStore = {
  steps: Step[];
  nodeAIState: Record<string, NodeAIState>;
  initializeSteps: (steps: Step[]) => void;
  insertInformationNote: (stepId: string) => void;
  insertAdditionalAttachment: (stepId: string) => void;
  removeNode: (stepId: string, nodeId: string) => void;
  setExplanation: (id: string, explanation: string) => void;
  setAnalyzerResult: (id: string, result: AnalyzerResult) => void;
};

export const useClaimStore = create<ClaimStore>((set) => ({
  steps: [],
  nodeAIState: {},
  initializeSteps: (steps) => set(() => ({ steps })),
  insertInformationNote: (stepId) =>
    set((state) => {
      return {
        steps: state.steps.map((step) =>
          step.id === stepId
            ? {
                ...step,
                nodes: [
                  ...(step.nodes ?? []),
                  {
                    id: crypto.randomUUID(),
                    type: 'note',
                    content: 'User added an information note.',
                  },
                ],
              }
            : step,
        ),
      };
    }),
  insertAdditionalAttachment: (stepId) =>
    set((state) => {
      return {
        steps: state.steps.map((step) =>
          step.id === stepId
            ? {
                ...step,
                nodes: [
                  ...(step.nodes ?? []),
                  {
                    id: crypto.randomUUID(),
                    type: 'attachment',
                    content: 'Additional file request created by user.',
                  },
                ],
              }
            : step,
        ),
      };
    }),
  removeNode: (stepId, nodeId) =>
    set((state) => {
      return {
        steps: state.steps.map((step) =>
          step.id === stepId
            ? {
                ...step,
                nodes: (step.nodes ?? []).filter((node) => node.id !== nodeId),
              }
            : step,
        ),
      };
    }),
  setExplanation: (id, explanation) =>
    set((state) => ({
      nodeAIState: {
        ...state.nodeAIState,
        [id]: { ...state.nodeAIState[id], explanation },
      },
    })),
  setAnalyzerResult: (id, analyzerResult) =>
    set((state) => ({
      nodeAIState: {
        ...state.nodeAIState,
        [id]: { ...state.nodeAIState[id], analyzerResult },
      },
    })),
}));
