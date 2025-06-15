import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { FormSchema } from '@/types/form';

const formsFilePath = path.join(process.cwd(), 'data', 'forms.json');

// GET /api/forms/[id] - Get a specific form by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileContents = await fs.readFile(formsFilePath, 'utf8');
    const forms: FormSchema[] = JSON.parse(fileContents);

    const form = forms.find(f => f.id === params.id);

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error reading form:', error);
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
  }
}

// PUT /api/forms/[id] - Update a specific form
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData: Partial<FormSchema> = await request.json();

    // Read existing forms
    const fileContents = await fs.readFile(formsFilePath, 'utf8');
    const forms: FormSchema[] = JSON.parse(fileContents);

    const formIndex = forms.findIndex(f => f.id === params.id);

    if (formIndex === -1) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Update form with new data
    forms[formIndex] = {
      ...forms[formIndex],
      ...formData,
      id: params.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    // Write back to file
    await fs.writeFile(formsFilePath, JSON.stringify(forms, null, 2));

    return NextResponse.json(forms[formIndex]);
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
  }
}

// DELETE /api/forms/[id] - Delete a specific form
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Read existing forms
    const fileContents = await fs.readFile(formsFilePath, 'utf8');
    const forms: FormSchema[] = JSON.parse(fileContents);

    const formIndex = forms.findIndex(f => f.id === params.id);

    if (formIndex === -1) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Remove form from array
    forms.splice(formIndex, 1);

    // Write back to file
    await fs.writeFile(formsFilePath, JSON.stringify(forms, null, 2));

    return NextResponse.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}
