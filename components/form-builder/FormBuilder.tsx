'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FormField, FormSchema, FieldType } from '@/types/form';
import { FieldPalette } from './FieldPalette';
import { FormCanvas } from './FormCanvas';
import { FieldConfigModal } from './FieldConfigModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Eye, Edit3, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormBuilderProps {
  initialForm?: FormSchema;
  onSave?: (form: FormSchema) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialForm,
  onSave,
}) => {
  const router = useRouter();
  const [formTitle, setFormTitle] = useState(initialForm?.title || 'New Form');
  const [formDescription, setFormDescription] = useState(initialForm?.description || '');
  const [fields, setFields] = useState<FormField[]>(initialForm?.fields || []);
  const [currentFormId, setCurrentFormId] = useState<string | null>(initialForm?.id || null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update currentFormId when initialForm changes
  React.useEffect(() => {
    if (initialForm?.id !== currentFormId) {
      setCurrentFormId(initialForm?.id || null);
    }
  }, [initialForm?.id, currentFormId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const generateFieldId = (type: FieldType): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${type}-${timestamp}-${random}`;
  };

  const getDefaultFieldLabel = (type: FieldType): string => {
    switch (type) {
      case 'text':
        return 'Text Input';
      case 'textarea':
        return 'Text Area';
      case 'select':
        return 'Select Option';
      case 'checkbox':
        return 'Checkbox';
      case 'radio':
        return 'Radio Group';
      default:
        return 'Field';
    }
  };

  const createNewField = (type: FieldType): FormField => {
    return {
      id: generateFieldId(type),
      type,
      label: getDefaultFieldLabel(type),
      placeholder: type === 'text' || type === 'textarea' ? `Enter ${getDefaultFieldLabel(type).toLowerCase()}` : '',
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
      order: fields.length,
    };
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragOver = (_event: DragOverEvent) => {
    // Handle drag over events if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle dropping from palette to canvas
    if (active.data.current?.type === 'field-type' && over.id === 'form-canvas') {
      const fieldType = active.data.current.fieldType as FieldType;
      const newField = createNewField(fieldType);
      setFields(prev => [...prev, newField]);

      // Automatically open config modal for new field
      setEditingField(newField);
      setIsConfigModalOpen(true);
      return;
    }

    // Handle reordering within canvas
    if (over.id !== active.id && over.id !== 'form-canvas') {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedFields = arrayMove(fields, oldIndex, newIndex);
        const updatedFields = reorderedFields.map((field, index) => ({
          ...field,
          order: index,
        }));
        setFields(updatedFields);
      }
    }
  };

  const handleFieldEdit = useCallback((field: FormField) => {
    setEditingField(field);
    setIsConfigModalOpen(true);
  }, []);

  const handleFieldDelete = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
  }, []);

  const handleFieldSave = useCallback((updatedField: FormField) => {
    setFields(prev => prev.map(field =>
      field.id === updatedField.id ? updatedField : field
    ));
  }, []);

  const handleSaveForm = async () => {
    if (!formTitle.trim()) {
      alert('Please enter a form title');
      return;
    }

    setIsSaving(true);
    try {
      const formData: Omit<FormSchema, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formTitle,
        description: formDescription,
        fields: fields.map((field, index) => ({ ...field, order: index })),
      };

      if (currentFormId) {
        // Update existing form
        const response = await fetch(`/api/forms/${currentFormId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update form');
        const updatedForm = await response.json();
        setCurrentFormId(updatedForm.id);
        onSave?.(updatedForm);
      } else {
        // Create new form
        const response = await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to create form');
        const newForm = await response.json();
        setCurrentFormId(newForm.id);
        onSave?.(newForm);
      }
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!currentFormId) {
      alert('Please save the form first to preview it');
      return;
    }
    router.push(`/forms/${currentFormId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!currentFormId}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSaveForm}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Form'}
            </Button>
          </div>
        </div>

        {/* Form Description */}
        <div className="mt-4 max-w-md flex flex-col gap-y-2">
        <div className="flex-1 max-w-md">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="md:text-2xl text-xl shadow-none font-semibold border-none p-0 h-auto focus-visible:ring-0 rounded-none flex-1"
                  placeholder="Form Title"
                />
              </div>
            </div>
          <Textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Form description (optional)"
            className="border-none p-0 resize-none focus-visible:ring-0 text-sm text-gray-600 shadow-none"
            rows={2}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex overflow-y-auto h-full w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <FieldPalette />
          <SortableContext
            items={fields.map(field => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <FormCanvas
              fields={fields}
              onFieldEdit={handleFieldEdit}
              onFieldDelete={handleFieldDelete}
            />
          </SortableContext>
        </DndContext>
      </div>

      {/* Field Configuration Modal */}
      <FieldConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setEditingField(null);
        }}
        field={editingField}
        onSave={handleFieldSave}
      />
    </div>
  );
};
