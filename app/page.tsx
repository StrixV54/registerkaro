'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FormSchema } from '@/types/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, FileText } from 'lucide-react';

export default function HomePage() {
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/forms');
      if (response.ok) {
        const formsData = await response.json();
        setForms(formsData);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
              <p className="text-gray-600 mt-1">Create and manage your forms</p>
            </div>
            <Link href="/designer">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Form
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No forms yet</h2>
            <p className="text-gray-600 mb-6">Get started by creating your first form</p>
            <Link href="/designer">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Forms</h2>
              <p className="text-gray-600">Manage and share your forms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <Card key={form.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    {form.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Form Stats */}
                      <div className="text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>Fields:</span>
                          <span className="font-medium">{form.fields.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span className="font-medium">
                            {new Date(form.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Link href={`/forms/${form.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        </Link>
                        <Link href={`/designer?formId=${form.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>

                      {/* Share URL */}
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-1">Share URL:</p>
                        <div className="flex items-center space-x-1">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                            {typeof window !== 'undefined'
                              ? `${window.location.origin}/forms/${form.id}`
                              : `/forms/${form.id}`}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-12 text-xs"
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/forms/${form.id}`
                                );
                              }
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
