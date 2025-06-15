'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FieldType } from '@/types/form';
import { Card, CardContent } from '@/components/ui/card';
import {
  Type,
  FileText,
  ChevronDown,
  CheckSquare,
  Circle
} from 'lucide-react';

interface FieldTypeConfig {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const fieldTypes: FieldTypeConfig[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: <Type className="w-5 h-5" />,
    description: 'Single line text input'
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: <FileText className="w-5 h-5" />,
    description: 'Multi-line text input'
  },
  {
    type: 'select',
    label: 'Select',
    icon: <ChevronDown className="w-5 h-5" />,
    description: 'Dropdown selection'
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: <CheckSquare className="w-5 h-5" />,
    description: 'Single checkbox'
  },
  {
    type: 'radio',
    label: 'Radio Group',
    icon: <Circle className="w-5 h-5" />,
    description: 'Multiple choice options'
  }
];

interface DraggableFieldProps {
  fieldType: FieldTypeConfig;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ fieldType }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `palette-${fieldType.type}`,
    data: {
      type: 'field-type',
      fieldType: fieldType.type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab py-2 active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <CardContent className="px-3">
        <div className="flex items-center space-x-3">
          <div className="text-blue-600 flex-shrink-0">
            {fieldType.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {fieldType.label}
            </h4>
            <p className="text-xs text-gray-500 truncate">
              {fieldType.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FieldPalette: React.FC = () => {
  return (
    <div className="w-72 flex flex-col bg-gray-50 border-r border-gray-200 p-4 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Field Types</h2>
        <p className="text-sm text-gray-600">
          Drag and drop fields to build your form
        </p>
      </div>

      <div className="gap-y-3 flex flex-col mb-8">
        {fieldTypes.map((fieldType) => (
          <DraggableField
            key={fieldType.type}
            fieldType={fieldType}
          />
        ))}
      </div>
    </div>
  );
};
