'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/form-builder/FormBuilder';
import { FormSchema } from '@/types/form';

export default function DesignerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formId = searchParams.get('formId');

  const [currentForm, setCurrentForm] = useState<FormSchema | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(!!formId);

  useEffect(() => {
    if (formId) {
      fetchForm(formId);
    }
  }, [formId]);

  const fetchForm = async (id: string) => {
    try {
      const response = await fetch(`/api/forms/${id}`);
      if (response.ok) {
        const form = await response.json();
        setCurrentForm(form);
      } else {
        console.error('Failed to fetch form');
        // If form doesn't exist, redirect to new form
        router.replace('/designer');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      router.replace('/designer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSave = (savedForm: FormSchema) => {
    setCurrentForm(savedForm);
    // Update URL to include the form ID if it's a new form
    if (!formId && savedForm.id) {
      router.replace(`/designer?formId=${savedForm.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading form...</div>
      </div>
    );
  }

  return (
    <FormBuilder
      initialForm={currentForm}
      onSave={handleFormSave}
    />
  );
}
