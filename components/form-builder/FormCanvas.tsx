'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField as FormFieldType } from '@/types/form';
import { FormField } from './FormField';
import { Plus } from 'lucide-react';

interface SortableFieldProps {
  field: FormFieldType;
  onEdit: (field: FormFieldType) => void;
  onDelete: (fieldId: string) => void;
}

const SortableField: React.FC<SortableFieldProps> = ({ field, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FormField
        field={field}
        isDesignMode={true}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

interface FormCanvasProps {
  fields: FormFieldType[];
  onFieldEdit: (field: FormFieldType) => void;
  onFieldDelete: (fieldId: string) => void;
}

export const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  onFieldEdit,
  onFieldDelete,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'form-canvas',
  });

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 p-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Builder</h2>
          <p className="text-gray-600">Design your form by dragging fields from the palette</p>
        </div>

        <div
          ref={setNodeRef}
          className={`min-h-96 p-6 border-2 border-dashed rounded-lg transition-colors ${
            isOver
              ? 'border-blue-400 bg-blue-50'
              : fields.length === 0
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Plus className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No fields yet</h3>
              <p className="text-sm text-center max-w-sm">
                Drag field types from the left panel to start building your form
              </p>
            </div>
          ) : (
            <SortableContext
              items={sortedFields.map(field => field.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sortedFields.map((field) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    onEdit={onFieldEdit}
                    onDelete={onFieldDelete}
                  />
                ))}
              </div>
            </SortableContext>
          )}

          {isOver && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-blue-700 text-sm text-center">
                Drop field here to add it to your form
              </p>
            </div>
          )}
        </div>

        {fields.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Form Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Fields:</span>
                <span className="font-medium ml-2">{fields.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Required Fields:</span>
                <span className="font-medium ml-2">
                  {fields.filter(f => f.required).length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Optional Fields:</span>
                <span className="font-medium ml-2">
                  {fields.filter(f => !f.required).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
