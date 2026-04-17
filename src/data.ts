import { z } from 'zod';
import type { AnalyzerResult, ClaimData, Step } from './types';

const processNodeSchema = z
  .record(z.string(), z.string())
  .refine((node) => 'title' in node && 'status' in node, {
    message: 'Each process node must include title and status.',
  });

const claimSchema = z.object({
  title: z.string(),
  fileNo: z.string(),
  estimatedRemainingTime: z.string(),
  currentStatus: z.string(),
  processDetails: z.array(processNodeSchema),
});

const rawClaimData = {
  title: 'Claim Process',
  fileNo: '923918230',
  estimatedRemainingTime: '20 Days',
  currentStatus: 'File Review Process Continues',
  processDetails: [
    {
      title: 'Towing Service',
      status: 'Completed',
      pickupLocation: 'Istanbul/Kadikoy',
      towingDate: '10/09/2025 14:30',
    },
    {
      title: 'Claim Notification',
      status: 'Completed',
      dateTime: '10/09/2025 16:00',
      reportType: 'Agreed Minutes',
      reasonForDamage: 'Collision',
      reportingParty: 'Grand Auto Services',
      contact: '0 (555) 000 00 00',
    },
    {
      title: 'Appraisal',
      status: 'Report Completed',
      expertAssignmentDate: '24.09.2025 10:30',
      expertInfo: 'John Doe Appraisal Services',
      contact: '0 216 555 55 55, 0 555 555 55 55',
    },
    {
      title: 'Substitute Rental Vehicle',
      status: 'Completed',
      vehicleDuration: '15 Days',
      vehicleModel: 'Volkswagen - Polo 1.4 TDI 90 Comf.',
      extraDuration: '0 days',
    },
    {
      title: 'File Review',
      status: 'In Progress',
      reviewReferralDate: '25.09.2025 09:00',
      reviewCompletionDate: 'dd/mm/yyyy 00:00',
    },
    {
      title: 'Deduction Reason',
      status: 'Pending',
      actionRequired: 'Upload Occupational Certificate',
      occupationalDeduction: '1.250 TL',
      appreciationDeduction: '3.400 TL',
      policyDeductible: '2.500 TL',
      nonDamageAmount: '0 TL',
    },
    {
      title: 'Payment Information',
      status: 'Pending',
      paidTo: 'Jane Smith',
      iban: 'TR823179327817000021',
      paymentAmount: '45.750 TL',
      note: 'Payment Refunded',
    },
    {
      title: 'Closed',
      status: 'Pending',
      completionDate: '23.09.2025 23:30',
    },
  ],
};

const normalizeNodes = (nodes: Array<Record<string, string> & { title: string; status: string }>): Step[] =>
  nodes.map((node, index) => ({
    id: `${node.title}-${index + 1}`,
    nodes: [],
    ...node,
  }));

export const fetchClaimData = async (): Promise<ClaimData> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const parsed = claimSchema.parse(rawClaimData);
  return {
    ...parsed,
    processDetails: normalizeNodes(parsed.processDetails as Array<Record<string, string> & { title: string; status: string }>),
  };
};

export const explainWithAI = async (title: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return `${title} adımı, hasar sürecindeki teknik dili sadeleştirir: bu noktada dosyanız kontrol edilerek bir sonraki aksiyon belirlenir.`;
};

export const analyzeDocument = async (fileName: string): Promise<AnalyzerResult> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const normalized = fileName.toLowerCase();
  if (normalized.includes('occupational') && normalized.endsWith('.pdf')) {
    return 'Accepted';
  }
  if (normalized.endsWith('.pdf')) {
    return 'Needs Review';
  }
  return 'Rejected';
};
