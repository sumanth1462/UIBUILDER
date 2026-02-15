# UIBuilder - Figma/Image to UI Code Generator

A powerful playground that transforms design images and Figma files into production-ready code across multiple frameworks. Upload a design, analyze it with AI, verify the output matches your expectations, and generate code for React, Angular, Flutter, or HTML.

## 🚀 Features

- **Design Upload**: Upload design images (PNG, JPG, GIF, WebP) or Figma files
- **AI-Powered Analysis**: Uses Claude 3.5 Sonnet to analyze designs and extract UI elements
- **Multi-Framework Code Generation**:
  - React (TSX/JSX)
  - Angular (TypeScript + Template)
  - Flutter (Dart)
  - HTML/CSS
- **Verification Workflow**: See analyzed design elements and verify they match across frameworks
- **Code Export**: Download or copy generated code
- **Responsive Design**: Works on desktop and tablet
- **Type-Safe**: Built with TypeScript for reliability

## 📋 Prerequisites

Before you start, you'll need:

1. **Node.js** (v16 or higher)
2. **Claude API Key** (get it from [platform.anthropic.com](https://console.anthropic.com/)) or any AI API KEY
3. **Figma API Key** (optional - for direct Figma integration)

## 🛠️ Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd uibuilder
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory:
   ```env
   VITE_CLAUDE_API_KEY=your_claude_api_key_here
   VITE_FIGMA_API_KEY=your_figma_api_key_here
   ```

## 🚀 Getting Started

### Development Server

Start the development server:
```bash
npm run dev
```
Start the development server:(both Frontent and backend)
```bash
npm run dev:full
```

This will open the application at `http://localhost:5173`
This will run server at `http://localhost:3001`

### Build for Production

```bash
npm run build
```

The compiled files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

### 1. Upload a Design

- **Upload an Image**: Drag and drop a screenshot or design image
- **Paste Figma URL**: Paste a Figma file URL to import directly

### 2. Analyze the Design

Click the "Analyze Design" button to:
- Extract UI elements using Claude
- Detect component types (buttons, inputs, text, etc.)
- Identify properties (colors, sizes, spacing)
- Get confidence scores and suggestions

### 3. Review the Analysis

- View the uploaded design image
- See detected elements listed
- Check the analysis confidence level
- Review AI suggestions for improvements

### 4. Generate Code

Select your target framework and options:
- **Framework**: React, Angular, Flutter, or HTML
- **Output Format**: Code or JSON structure
- **Click "Generate Code"** to produce the output

### 5. Export the Code

- **Copy**: Copy the code to clipboard
- **Download**: Download as a file with proper extension

## 📁 Project Structure

```
uibuilder/
├── src/
│   ├── api/              # API integrations (Claude, Figma)
│   ├── components/       # React components
│   ├── generator/        # Code generation engines
│   ├── store/           # State management (Zustand)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   ├── App.css          # Global styles
│   ├── main.tsx         # React entry point
│   └── index.css        # Global CSS
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## 🔑 Key Components

### Components
- **UploadSection**: File/image upload with drag & drop
- **DesignPreview**: Display uploaded design and analysis results
- **CodeGenerator**: Framework selection and code generation

### API Integration
- **Claude API**: Design analysis and element extraction
- **Figma API**: Direct Figma file support (optional)

### Code Generators
- **React**: Generates functional components with hooks
- **Angular**: Generates component structure
- **Flutter**: Generates Dart widget code
- **HTML**: Generates semantic HTML5 with CSS

## 🎯 Workflow Example

1. Take a screenshot of a landing page
2. Upload it to UIBuilder
3. Click "Analyze Design"
4. Review the detected elements (header, buttons, forms, etc.)
5. Switch to "Generate Code" tab
6. Select "React" framework
7. Click "Generate Code"
8. Review the generated React component
9. Download or copy the code
10. Integrate into your project

## ⚙️ Configuration

### Environment Variables

- `VITE_CLAUDE_API_KEY`: Your Anthropic Claude API key
- `VITE_FIGMA_API_KEY`: Your Figma API token (optional)

### Customization

You can customize code generators by modifying files in `src/generator/index.ts`:
- Add custom component templates
- Modify generated code structure
- Add new framework support
- Customize styling approaches

## 🚀 Extending the Project

### Add a New Framework

1. Add the framework type to `CodeGenerationOptions` in `src/types/index.ts`
2. Create a generator function in `src/generator/index.ts`
3. Add the case handler in `generateCode()`
4. Test with sample designs

### Add Custom Code Templates

Modify the generator functions to use your preferred patterns:
- Change component structure
- Add styling libraries (styled-components, Tailwind, etc.)
- Include state management setup
- Add testing templates

## 🤝 API Requirements

### Claude API
- Model: `claude-3-5-sonnet-20241022`
- Max tokens: 2000
- Image support via URL or base64

### Figma API
- Get files: `/v1/files/{fileKey}`
- Get images: `/v1/files/{fileKey}/images`
- Export nodes: `/v1/files/{fileKey}/nodes`

## 📝 Notes

- The AI analysis confidence score indicates how well elements were detected
- JSON output format is useful for custom processing pipelines
- Generated code is a starting point - customize for your needs
- Code quality improves with clearer, more structured designs

## 🐛 Troubleshooting

### API Keys Not Working
- Verify keys are correctly added to `.env.local`
- Check API key permissions and quota
- Ensure keys haven't expired

### Design Analysis Failing
- Use clearer, well-structured design images
- Avoid cluttered or overlapping elements
- Ensure image is at least 400x300px

### Code Generation Issues
- Clear browser cache if seeing old output
- Check console for detailed error messages
- Verify element properties are complete

## 📄 License

This project is provided as-is for educational and commercial use.

## 🙋 Support

For issues or feature requests, please check the troubleshooting section or review the API documentation:
- [Anthropic Claude Docs](https://docs.anthropic.com/)
- [Figma API Docs](https://www.figma.com/developers/api)

---

**Happy designing! 🎨** Transform your designs into code in seconds!
