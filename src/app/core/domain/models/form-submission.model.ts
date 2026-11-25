export interface FormField {
  label: string;
  value: string | boolean;
}

export type FormKind = 'contact' | 'support';

export interface FormSubmission {
  kind: FormKind;
  subject: string;
  replyTo: string;
  fields: FormField[];
  submittedAt: string;
}
