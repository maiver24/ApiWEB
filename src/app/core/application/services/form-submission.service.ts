import { Injectable, inject } from '@angular/core';
import { FORM_STORAGE, FORM_SUBMIT, FormStoragePort, FormSubmission, FormSubmitPort } from '../../domain';

@Injectable({ providedIn: 'root' })
export class FormSubmissionService {
  private submitPort = inject(FORM_SUBMIT);
  private storagePort = inject(FORM_STORAGE);

  async send(submission: FormSubmission): Promise<boolean> {
    const sent = await this.submitPort.submit(submission);
    if (sent) this.storagePort.save(submission);
    return sent;
  }
}
