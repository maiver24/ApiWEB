import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormSubmitPort, FormSubmission } from '../../domain';

@Injectable({ providedIn: 'root' })
export class FormSubmitAdapter implements FormSubmitPort {
  async submit(submission: FormSubmission): Promise<boolean> {
    const body = {
      _subject: submission.subject,
      _replyto: submission.replyTo,
      _template: 'table',
      _honey: '',
      email: submission.replyTo,
      formulario: submission.kind,
      fecha: submission.submittedAt,
      message: submission.fields.map(field => `${field.label}: ${String(field.value)}`).join('\n'),
    };

    const res = await fetch(environment.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    if (String(data?.success) !== 'true') {
      throw new Error(data?.message ?? `Error al enviar el formulario (${res.status})`);
    }

    return true;
  }
}
