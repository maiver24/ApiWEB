import { Component, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FormSubmissionService } from '../../core/application';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements AfterViewInit {
  private formSubmission = inject(FormSubmissionService);

  selectedType: string = 'Petición';
  activeCategory = -1;
  showSuccessToast = signal(false);
  isSubmitting = signal(false);
  formError = signal('');
  animateIn = signal(false);

  formData: { name: string; email: string; description: string; acceptPolicy: boolean } = {
    name: '', email: '', description: '', acceptPolicy: false
  };

  pqrsfTypes: string[] = ['Petición','Queja','Reclamo','Sugerencia','Felicitación'];

  responseTimes: Record<string, string> = {
    'Petición': '15 a 30 días hábiles',
    'Queja': '15 días hábiles',
    'Reclamo': '15 días hábiles',
    'Sugerencia': 'Sin término establecido',
    'Felicitación': 'Sin término establecido',
  };

  statusItems = [
    { name: 'SynQC', status: 'ok', uptime: '99.9%', incidents: '0 este mes' },
    { name: 'SynCryd', status: 'ok', uptime: '99.8%', incidents: '0 este mes' },
    { name: 'SynClin', status: 'ok', uptime: '99.7%', incidents: '1 resuelto' },
    { name: 'SynInv', status: 'ok', uptime: '99.9%', incidents: '0 este mes' },
    { name: 'SynMet', status: 'maintenance', uptime: '95.2%', incidents: 'Mantenimiento programado' },
    { name: 'SynAgend', status: 'ok', uptime: '99.9%', incidents: '0 este mes' },
  ];

  get responseTime(): string {
    return this.responseTimes[this.selectedType] || '';
  }

  categories: { label: string; desc: string }[] = [];
  searchQuery: string = '';
  filteredCategories: { label: string; desc: string }[] = [];

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCategories = this.categories;
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredCategories = this.categories.filter(
      c => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }

  toggleCategory(index: number): void {
    this.activeCategory = this.activeCategory === index ? -1 : index;
  }

  async onSubmitForm(): Promise<void> {
    if (!this.formData.name || !this.formData.email || !this.formData.description || !this.formData.acceptPolicy) return;

    this.isSubmitting.set(true);
    this.formError.set('');

    try {
      await this.formSubmission.send({
        kind: 'support',
        subject: `PQRSF - ${this.selectedType} - ${this.formData.name}`,
        replyTo: this.formData.email,
        submittedAt: new Date().toISOString(),
        fields: [
          { label: 'Tipo', value: this.selectedType },
          { label: 'Nombre o entidad', value: this.formData.name },
          { label: 'Correo', value: this.formData.email },
          { label: 'Descripción', value: this.formData.description },
          { label: 'Aceptó política', value: this.formData.acceptPolicy },
        ],
      });

      this.formData = { name: '', email: '', description: '', acceptPolicy: false };
      this.showSuccessToast.set(true);

      setTimeout(() => {
        this.showSuccessToast.set(false);
      }, 4000);
    } catch (err) {
      this.formError.set('Ocurrió un error al enviar la solicitud. Intenta nuevamente.');
      console.error('PQRSF submission error:', err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.animateIn.set(true), 100);
  }
}
