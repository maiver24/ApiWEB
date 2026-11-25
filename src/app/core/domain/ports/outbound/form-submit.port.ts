import { InjectionToken } from '@angular/core';
import { FormSubmission } from '../../models/form-submission.model';

export interface FormSubmitPort {
  submit(submission: FormSubmission): Promise<boolean>;
}

export const FORM_SUBMIT = new InjectionToken<FormSubmitPort>('FORM_SUBMIT');
