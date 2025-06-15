# Dynamic Drag & Drop Form Builder

A modern, no-code form designer built with Next.js and TypeScript. Create forms visually by dragging and dropping field types, configure properties, and collect submissions.

## ✨ Features

- **Visual Form Designer**: Drag and drop interface for building forms
- **Multiple Field Types**: Text, textarea, select, checkbox, and radio buttons
- **Real-time Configuration**: Edit labels, placeholders, validation, and options
- **Form Preview & Validation**: Test forms before publishing
- **Responsive Design**: Works on desktop, tablet, and mobile
- **JSON Storage**: Simple file-based form storage

## 🚀 Quick Start

```bash
# Clone and install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building forms.

## 📁 Project Structure

```
form-builder/
├── app/
│   ├── api/forms/          # Form CRUD API routes
│   ├── designer/           # Form builder page
│   ├── forms/[id]/         # Form preview/submission page
│   └── page.tsx           # Home page
├── components/
│   ├── form-builder/      # Drag & drop form builder
│   └── form-preview/      # Form display & submission
├── data/forms.json        # Sample form data
└── types/form.ts          # TypeScript definitions
```

## 🎯 Usage

1. **Create Form**: Visit `/designer` and drag fields from the palette
2. **Configure Fields**: Click settings icon to customize labels, options, etc.
3. **Save & Preview**: Save your form, then preview to test functionality
4. **Share**: Copy the form URL to collect submissions

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms` | List all forms |
| POST | `/api/forms` | Create new form |
| GET | `/api/forms/[id]` | Get specific form |
| PUT | `/api/forms/[id]` | Update form |
| POST | `/api/forms/[id]/submissions` | Submit form data |

## 🚀 Deployment

Deploy to Vercel with one click or build manually:

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
