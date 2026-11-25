import { Injectable } from '@angular/core';
import { FormStoragePort, FormSubmission } from '../../domain';

const STORAGE_KEY = 'synapse.form.submissions';

@Injectable({ providedIn: 'root' })
export class LocalFormStorageAdapter implements FormStoragePort {
  save(submission: FormSubmission): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([submission, ...this.list()].slice(0, 30)));
    } catch {
      return;
    }
  }

  list(): FormSubmission[] {
    if (typeof localStorage === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed as FormSubmission[] : [];
    } catch {
      return [];
    }
  }
}
