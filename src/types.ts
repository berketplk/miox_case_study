export type NodeStatus = 'Completed' | 'In Progress' | 'Pending' | 'Report Completed';

export type StepNode = {
  id: string;
  type: 'note' | 'attachment';
  content: string;
};

export type Step = {
  id: string;
  title: string;
  status: NodeStatus | string;
  nodes?: StepNode[];
  pickupLocation?: string;
  towingDate?: string;
  dateTime?: string;
  reportType?: string;
  reasonForDamage?: string;
  reportingParty?: string;
  contact?: string;
  expertAssignmentDate?: string;
  expertInfo?: string;
  vehicleDuration?: string;
  vehicleModel?: string;
  extraDuration?: string;
  reviewReferralDate?: string;
  reviewCompletionDate?: string;
  actionRequired?: string;
  occupationalDeduction?: string;
  appreciationDeduction?: string;
  policyDeductible?: string;
  nonDamageAmount?: string;
  paidTo?: string;
  iban?: string;
  paymentAmount?: string;
  note?: string;
  completionDate?: string;
};

export type ClaimData = {
  title: string;
  fileNo: string;
  estimatedRemainingTime: string;
  currentStatus: string;
  processDetails: Step[];
};

export type AnalyzerResult = 'Accepted' | 'Needs Review' | 'Rejected' | null;
