import React from 'react';
import { notFound } from 'next/navigation';
import { FormPreview } from '@/components/form-preview/FormPreview';
import { FormSchema } from '@/types/form';

interface FormPageProps {
  params: {
    id: string;
  };
}

async function getForm(id: string): Promise<FormSchema | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/forms/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching form:', error);
    return null;
  }
}

export default async function FormPage({ params }: FormPageProps) {
  const form = await getForm(params.id);

  if (!form) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <FormPreview form={form} />
    </div>
  );
}
