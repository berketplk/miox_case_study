import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClaimData } from './data';
import { MobileAccordion, StepDetailCard, StepList, SummaryCard, hasActionRequired } from './components';
import { useClaimStore } from './store';

export default function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['claim-data'],
    queryFn: fetchClaimData,
  });

  const steps = useClaimStore((state) => state.steps);
  const initializeSteps = useClaimStore((state) => state.initializeSteps);
  const [activeStepId, setActiveStepId] = useState('');

  useEffect(() => {
    if (data) {
      initializeSteps(data.processDetails);
    }
  }, [data, initializeSteps]);

  useEffect(() => {
    if (!steps.length) {
      return;
    }
    if (!activeStepId || !steps.some((step) => step.id === activeStepId)) {
      setActiveStepId(steps[0].id);
    }
  }, [steps, activeStepId]);

  const activeStep = useMemo(() => steps.find((step) => step.id === activeStepId) ?? steps[0], [steps, activeStepId]);
  const pendingActions = useMemo(() => steps.filter(hasActionRequired), [steps]);
  const completedSteps = useMemo(
    () => steps.filter((step) => step.status === 'Completed' || step.status === 'Report Completed').length,
    [steps],
  );
  const progressPercent = useMemo(() => (steps.length ? Math.round((completedSteps / steps.length) * 100) : 0), [completedSteps, steps.length]);

  if (isLoading) {
    return <main className="mx-auto max-w-6xl p-4">Loading claim dashboard...</main>;
  }

  if (isError || !data) {
    return <main className="mx-auto max-w-6xl p-4">Could not load claim data.</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <header className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Technical Case Study</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{data.title}</h1>
          <div className="mt-4 space-y-2">
            {pendingActions.length > 0 && (
              <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800">
                You have pending actions ({pendingActions.length})
              </div>
            )}
            <div>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                <span>Progress</span>
                <span>
                  {completedSteps} / {steps.length} completed
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-slate-900 transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-3 md:grid-cols-3">
          <SummaryCard label="Current Status" value={data.currentStatus} />
          <SummaryCard label="File Number" value={data.fileNo} />
          <SummaryCard label="Estimated Remaining Time" value={data.estimatedRemainingTime} />
        </section>

        <MobileAccordion steps={steps} />

        <section className="hidden gap-4 md:grid md:grid-cols-[360px_1fr]">
          <StepList steps={steps} activeId={activeStep?.id ?? ''} onSelect={setActiveStepId} />
          {activeStep ? <StepDetailCard step={activeStep} /> : null}
        </section>
      </div>
    </main>
  );
}
