'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormSchema, FormField as FormFieldType } from '@/types/form';
import { FormField } from '@/components/form-builder/FormField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface FormPreviewProps {
  form: FormSchema;
}

interface FormErrors {
  [fieldId: string]: string;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = (field: FormFieldType, value: any): string | null => {
    if (field.required) {
      if (field.type === 'checkbox') {
        if (!value) {
          return `${field.label} is required`;
        }
      } else if (!value || (typeof value === 'string' && !value.trim())) {
        return `${field.label} is required`;
      }
    }

    // Additional validation can be added here
    if (field.type === 'text' && field.label.toLowerCase().includes('email') && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    form.fields.forEach(field => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error for this field if it exists
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/forms/${form.id}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);
      setFormData({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
    setIsSubmitted(false);
    setSubmitError(null);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your form has been submitted successfully. We'll get back to you soon.
            </p>
            <Button onClick={handleReset} variant="outline">
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Forms</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{form.title}</CardTitle>
          {form.description && (
            <p className="text-gray-600 mt-2">{form.description}</p>
          )}
        </CardHeader>
        <CardContent>
          {submitError && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {sortedFields.map((field) => (
              <div key={field.id}>
                <FormField
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
                {errors[field.id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Form'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Form Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Form created on {new Date(form.createdAt).toLocaleDateString()}</p>
        {form.updatedAt !== form.createdAt && (
          <p>Last updated on {new Date(form.updatedAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};
