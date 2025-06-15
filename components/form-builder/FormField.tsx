/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { FormField as FormFieldType } from '@/types/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, GripVertical } from 'lucide-react';

interface FormFieldProps {
  field: FormFieldType;
  isDesignMode?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  onEdit?: (field: FormFieldType) => void;
  onDelete?: (fieldId: string) => void;
  dragHandleProps?: any;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  isDesignMode = false,
  value,
  onChange,
  onEdit,
  onDelete,
  dragHandleProps
}) => {
  const handleInputChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderFieldInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={isDesignMode}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={isDesignMode}
            rows={4}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleInputChange} disabled={isDesignMode}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={handleInputChange}
              disabled={isDesignMode}
            />
            <Label htmlFor={field.id} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.id}-${index}`}
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(e.target.value)}
                  disabled={isDesignMode}
                  className="w-4 h-4"
                />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isDesignMode) {
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow py-3">
        <CardContent className="px-4">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center space-x-2 flex-1">
              <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(field)}
                className="h-8 w-8 p-0"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(field.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {field.type !== 'checkbox' && (
            <div className="">
              {renderFieldInput()}
            </div>
          )}
          {field.type === 'checkbox' && renderFieldInput()}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      {field.type !== 'checkbox' && (
        <Label className="text-sm font-medium mb-2 block">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderFieldInput()}
    </div>
  );
};
