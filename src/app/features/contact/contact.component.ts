import { Component, signal, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ContactForm } from '../../core/domain';
import { ContactService } from '../../core/application';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements AfterViewInit {
  private contactService = inject(ContactService);

  form: ContactForm = { name:'', email:'', sector:'', complexity:'', requirement:'', acceptPolicy: false };

  submitting  = signal(false);
  submitted   = signal(false);
  errorMsg   = signal('');
  animateIn = signal(false);

  sectors = [
    { value: 'health',     label: 'Salud / Laboratorio Clínico' },
    { value: 'industrial', label: 'Industria / Manufacturing' },
    { value: 'retail',     label: 'Retail / Comercial' },
    { value: 'other',      label: 'Otro' },
  ];

  complexityLevels = ['Nivel I - Básico', 'Nivel II - Intermedio', 'Nivel III - Avanzado', 'Nivel IV - Enterprise'];

  selectedComplexity = '';

  get isValid(): boolean {
    return !!(this.form.name && this.form.email && this.form.sector &&
              this.selectedComplexity && this.form.requirement && this.form.acceptPolicy);
  }

  async onSubmit(): Promise<void> {
    if (!this.isValid) return;
    this.submitting.set(true);
    this.errorMsg.set('');
    try {
      await this.contactService.submit({
        ...this.form,
        complexity: this.selectedComplexity,
      });
      this.submitted.set(true);
    } catch (err) {
      this.errorMsg.set('Ocurrió un error al enviar el formulario. Intenta nuevamente.');
      console.error('Contact submission error:', err);
    } finally {
      this.submitting.set(false);
    }
  }

  private defaultForm(): ContactForm {
    return { name:'', email:'', sector:'', complexity:'', requirement:'', acceptPolicy: false };
  }

  reset(): void {
    this.submitted.set(false);
    this.submitting.set(false);
    this.errorMsg.set('');
    this.form = this.defaultForm();
    this.selectedComplexity = '';
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.animateIn.set(true), 100);
  }
}
