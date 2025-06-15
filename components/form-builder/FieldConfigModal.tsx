'use client';

import React, { useState, useEffect } from 'react';
import { FormField, FieldType } from '@/types/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface FieldConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FormField | null;
  onSave: (field: FormField) => void;
}

export const FieldConfigModal: React.FC<FieldConfigModalProps> = ({
  isOpen,
  onClose,
  field,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<FormField>>({
    label: '',
    placeholder: '',
    required: false,
    options: [],
  });

  useEffect(() => {
    if (field) {
      setFormData({
        label: field.label || '',
        placeholder: field.placeholder || '',
        required: field.required || false,
        options: field.options || [],
      });
    } else {
      setFormData({
        label: '',
        placeholder: '',
        required: false,
        options: [],
      });
    }
  }, [field]);

  const handleSave = () => {
    if (!field || !formData.label) return;

    const updatedField: FormField = {
      ...field,
      label: formData.label,
      placeholder: formData.placeholder || '',
      required: formData.required || false,
      options: formData.options || [],
    };

    onSave(updatedField);
    onClose();
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), ''],
    }));
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.map((option, i) => i === index ? value : option) || [],
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || [],
    }));
  };

  const needsOptions = field?.type === 'select' || field?.type === 'radio';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Configure {field?.type === 'text' ? 'Text Input' :
                    field?.type === 'textarea' ? 'Text Area' :
                    field?.type === 'select' ? 'Select' :
                    field?.type === 'checkbox' ? 'Checkbox' :
                    field?.type === 'radio' ? 'Radio Group' : 'Field'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label">Label *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Enter field label"
            />
          </div>

          {/* Placeholder - not for checkbox/radio */}
          {field?.type !== 'checkbox' && field?.type !== 'radio' && (
            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={formData.placeholder}
                onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          {/* Required checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={formData.required}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, required: checked as boolean }))
              }
            />
            <Label htmlFor="required">Required field</Label>
          </div>

          {/* Options for select/radio */}
          {needsOptions && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formData.options?.map((option, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
              </div>

              {(!formData.options || formData.options.length === 0) && (
                <div className="text-sm text-gray-500 text-center py-4 border border-dashed rounded">
                  No options added yet. Click "Add Option" to get started.
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.label || (needsOptions && (!formData.options || formData.options.length === 0))}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
