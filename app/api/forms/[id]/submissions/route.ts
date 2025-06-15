import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { FormSubmission } from '@/types/form';

const submissionsFilePath = path.join(process.cwd(), 'data', 'submissions.json');

// Ensure submissions file exists
async function ensureSubmissionsFile() {
  try {
    await fs.access(submissionsFilePath);
  } catch {
    await fs.writeFile(submissionsFilePath, '[]');
  }
}

// POST /api/forms/[id]/submissions - Submit form data
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionData = await request.json();

    await ensureSubmissionsFile();

    // Read existing submissions
    const fileContents = await fs.readFile(submissionsFilePath, 'utf8');
    const submissions: FormSubmission[] = JSON.parse(fileContents);

    // Create new submission
    const newSubmission: FormSubmission = {
      id: `submission-${Date.now()}`,
      formId: params.id,
      data: submissionData,
      submittedAt: new Date().toISOString(),
    };

    // Add to submissions array
    submissions.push(newSubmission);

    // Write back to file
    await fs.writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}

// GET /api/forms/[id]/submissions - Get all submissions for a form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureSubmissionsFile();

    const fileContents = await fs.readFile(submissionsFilePath, 'utf8');
    const submissions: FormSubmission[] = JSON.parse(fileContents);

    const formSubmissions = submissions.filter(s => s.formId === params.id);

    return NextResponse.json(formSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
