import { InjectionToken } from '@angular/core';
import { FormSubmission } from '../../models/form-submission.model';

export interface FormStoragePort {
  save(submission: FormSubmission): void;
  list(): FormSubmission[];
}

export const FORM_STORAGE = new InjectionToken<FormStoragePort>('FORM_STORAGE');
