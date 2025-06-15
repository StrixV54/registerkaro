import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { FormSchema } from '@/types/form';

const formsFilePath = path.join(process.cwd(), 'data', 'forms.json');

// GET /api/forms - Get all forms
export async function GET() {
  try {
    const fileContents = await fs.readFile(formsFilePath, 'utf8');
    const forms: FormSchema[] = JSON.parse(fileContents);
    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error reading forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}

// POST /api/forms - Create a new form
export async function POST(request: NextRequest) {
  try {
    const formData: Omit<FormSchema, 'id' | 'createdAt' | 'updatedAt'> = await request.json();

    // Read existing forms
    const fileContents = await fs.readFile(formsFilePath, 'utf8');
    const forms: FormSchema[] = JSON.parse(fileContents);

    // Create new form with generated ID and timestamps
    const newForm: FormSchema = {
      ...formData,
      id: `form-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to forms array
    forms.push(newForm);

    // Write back to file
    await fs.writeFile(formsFilePath, JSON.stringify(forms, null, 2));

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}
