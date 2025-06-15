export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio
  order: number;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}

export interface DragItem {
  id: string;
  type: FieldType;
  label: string;
}
