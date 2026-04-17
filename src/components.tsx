import { useMemo, useState, type JSX } from 'react';
import { Bot, ChevronDown, FileCheck2, Paperclip, Plus, StickyNote, Trash2, TriangleAlert } from 'lucide-react';
import { analyzeDocument, explainWithAI } from './data';
import { useClaimStore } from './store';
import type { Step } from './types';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';

const statusClass: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Report Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
};

const labelize = (value: string) =>
  value.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());

export const hasActionRequired = (step: Step) => Boolean(step.actionRequired);

const GenericStepDetails = ({ step }: { step: Step }) => {
  const entries = Object.entries(step).filter(([key]) => !['id', 'title', 'status', 'nodes'].includes(key));
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-md bg-slate-50 p-2">
          <dt className="text-xs text-slate-500">{labelize(key)}</dt>
          <dd className="text-sm font-medium text-slate-700">{String(value ?? '-')}</dd>
        </div>
      ))}
    </dl>
  );
};

const TowingServiceDetails = ({ step }: { step: Step }) => (
  <section className="grid gap-2 sm:grid-cols-2">
    <Card className="p-3">
      <p className="text-xs text-slate-500">Pickup Location</p>
      <p className="text-sm font-medium text-slate-800">{step.pickupLocation}</p>
    </Card>
    <Card className="p-3">
      <p className="text-xs text-slate-500">Towing Date</p>
      <p className="text-sm font-medium text-slate-800">{step.towingDate}</p>
    </Card>
  </section>
);

const FileReviewDetails = ({ step }: { step: Step }) => (
  <section className="grid gap-2 sm:grid-cols-2">
    <Card className="p-3">
      <p className="text-xs text-slate-500">Referral Date</p>
      <p className="text-sm font-medium text-slate-800">{step.reviewReferralDate}</p>
    </Card>
    <Card className="p-3">
      <p className="text-xs text-slate-500">Planned Completion</p>
      <p className="text-sm font-medium text-slate-800">{step.reviewCompletionDate}</p>
    </Card>
  </section>
);

const DeductionReasonDetails = ({ step }: { step: Step }) => (
  <section className="space-y-3">
    <Card className="border-rose-300 bg-rose-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Action Required</p>
      <p className="mt-1 text-sm font-semibold text-rose-900">{step.actionRequired}</p>
    </Card>
    <GenericStepDetails step={step} />
  </section>
);

const ClosedStepDetails = ({ step }: { step: Step }) => (
  <p className="text-sm text-slate-700">Planned completion: {step.completionDate ?? '-'}</p>
);

const stepRegistry: Record<string, (step: Step) => JSX.Element> = {
  'Towing Service': (step) => <TowingServiceDetails step={step} />,
  'File Review': (step) => <FileReviewDetails step={step} />,
  'Deduction Reason': (step) => <DeductionReasonDetails step={step} />,
  Closed: (step) => <ClosedStepDetails step={step} />,
};

const StepNodes = ({ stepId, nodes = [] }: { stepId: string; nodes?: Step['nodes'] }) => {
  const removeNode = useClaimStore((state) => state.removeNode);
  if (!nodes.length) return null;

  return (
    <section className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Step Nodes</p>
      <div className="space-y-2">
        {nodes.map((node) => (
          <div key={node.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              {node.type === 'note' ? <StickyNote size={14} /> : <Paperclip size={14} />}
              <span>{node.content}</span>
            </div>
            <Button variant="danger" className="h-8 px-2" onClick={() => removeNode(stepId, node.id)}>
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

const AnalyzerBlock = ({ step }: { step: Step }) => {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const result = useClaimStore((state) => state.nodeAIState[step.id]?.analyzerResult);
  const setAnalyzerResult = useClaimStore((state) => state.setAnalyzerResult);

  if (!step.actionRequired?.toLowerCase().includes('occupational certificate')) {
    return null;
  }

  return (
    <div className="mt-3 rounded-md border border-slate-200 p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
        <FileCheck2 size={16} />
        AI Document Analyzer
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="flex-1 py-1 file:mr-2 file:h-7 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:text-xs file:align-middle"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
        />
        <Button
          onClick={async () => {
            if (!fileName) return;
            setLoading(true);
            const next = await analyzeDocument(fileName);
            setAnalyzerResult(step.id, next);
            setLoading(false);
          }}
          className="w-full px-4 sm:w-auto"
          disabled={loading || !fileName}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
      {result && (
        <p className="mt-2 text-sm text-slate-700">
          AI Validation: <strong>{result === 'Rejected' ? 'Invalid' : 'Valid'}</strong> ({result})
        </p>
      )}
    </div>
  );
};

export const StepDetailCard = ({ step }: { step: Step }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const explanation = useClaimStore((state) => state.nodeAIState[step.id]?.explanation);
  const setExplanation = useClaimStore((state) => state.setExplanation);
  const insertInformationNote = useClaimStore((state) => state.insertInformationNote);
  const insertAdditionalAttachment = useClaimStore((state) => state.insertAdditionalAttachment);

  const renderDetails = useMemo(
    () => stepRegistry[step.title] ?? ((input: Step) => <GenericStepDetails step={input} />),
    [step.title],
  );

  return (
    <Card className={`rounded-2xl shadow-md transition ${hasActionRequired(step) ? 'border-rose-300' : ''}`}>
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
          {hasActionRequired(step) && <Badge className="border-rose-300 bg-rose-100 text-rose-700">Action Required</Badge>}
        </div>
        <Badge className={statusClass[step.status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}>{step.status}</Badge>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-3">{renderDetails(step)}</section>
      <AnalyzerBlock step={step} />
      <StepNodes stepId={step.id} nodes={step.nodes} />

      <section className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Node Actions</p>
        <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={async () => {
              setAiLoading(true);
              const text = await explainWithAI(step.title);
              setExplanation(step.id, text);
              setShowExplanation(true);
              setAiLoading(false);
            }}
          >
            <Bot size={16} />
            {aiLoading ? 'Explaining...' : 'Explain with AI'}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => insertInformationNote(step.id)}>
            <Plus size={16} />
            Information Note
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => insertAdditionalAttachment(step.id)}>
            <Plus size={16} />
            Additional Attachment
          </Button>
        </div>
      </section>

      {explanation && (
        <details className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3" open={showExplanation}>
          <summary className="cursor-pointer text-sm font-medium text-blue-900" onClick={() => setShowExplanation((prev) => !prev)}>
            AI Explanation
          </summary>
          <p className="mt-2 text-sm text-blue-900">{explanation}</p>
        </details>
      )}
    </Card>
  );
};

export const SummaryCard = ({ label, value }: { label: string; value: string }) => (
  <Card className="rounded-2xl shadow-md">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
  </Card>
);

export const StepList = ({
  steps,
  activeId,
  onSelect,
}: {
  steps: Step[];
  activeId: string;
  onSelect: (id: string) => void;
}) => (
  <Card className="rounded-2xl p-3 shadow-md">
    <h2 className="mb-3 text-sm font-semibold text-slate-700">Step Timeline</h2>
    <div className="space-y-2">
      {steps.map((step, index) => (
        <button
          key={step.id}
          type="button"
          onClick={() => onSelect(step.id)}
          className={`w-full rounded-lg border p-3 text-left transition ${
            activeId === step.id
              ? hasActionRequired(step)
                ? 'border-rose-500 bg-rose-50 shadow-sm'
                : 'border-slate-800 bg-slate-50 shadow-sm'
              : hasActionRequired(step)
                ? 'border-rose-300 bg-white hover:border-rose-400 hover:bg-rose-50'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <p className="text-xs text-slate-500">Step {index + 1}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900">{step.title}</p>
            {(step.nodes?.length ?? 0) > 0 && <Badge className="border-slate-200 bg-slate-100 text-slate-700">📝 ({step.nodes?.length})</Badge>}
            {hasActionRequired(step) && <TriangleAlert size={14} className="text-rose-600" />}
          </div>
          <Badge className={`mt-2 ${statusClass[step.status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>{step.status}</Badge>
          {hasActionRequired(step) && <p className="mt-2 text-xs font-medium text-rose-700">Action: {step.actionRequired}</p>}
        </button>
      ))}
    </div>
  </Card>
);

export const MobileAccordion = ({ steps }: { steps: Step[] }) => (
  <div className="space-y-3 md:hidden">
    {steps.map((step, index) => (
      <details key={step.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md" open={index === 0}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900">{step.title}</span>
            {(step.nodes?.length ?? 0) > 0 && <Badge className="border-slate-200 bg-slate-100 text-slate-700">📝 ({step.nodes?.length})</Badge>}
            {hasActionRequired(step) && <TriangleAlert size={14} className="text-rose-600" />}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusClass[step.status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}>{step.status}</Badge>
            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </summary>
        <div className="mt-4">
          <StepDetailCard step={step} />
        </div>
      </details>
    ))}
  </div>
);
