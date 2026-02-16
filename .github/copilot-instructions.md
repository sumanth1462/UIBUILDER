# UIBuilder Development Instructions

## Project Overview
UIBuilder is a React + TypeScript application that transforms design images and Figma files into production-ready code for multiple frameworks (React, Angular, Flutter, HTML).

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **API Integration**: Axios
- **Styling**: CSS Modules
- **File Upload**: react-dropzone

## Setup Instructions

### Prerequisites
- Node.js 16+
- Claude API Key (from platform.anthropic.com)
- Figma API Key (optional)

### Development Setup
1. Run `npm install` to install dependencies
2. Create `.env.local` with your API keys
3. Run `npm run dev` to start development server
4. Open http://localhost:5173 in your browser

## Key Features
1. **Design Upload**: Support for images and Figma files
2. **AI Analysis**: Claude-powered design element detection
3. **Code Generation**: Multi-framework code output
4. **Verification Workflow**: Review and match designs before generation

## File Structure
- `src/api/` - API integrations (Claude, Figma)
- `src/components/` - React UI components
- `src/generator/` - Code generation engines
- `src/store/` - Zustand state management
- `src/types/` - TypeScript type definitions
- `src/utils/` - Helper functions

## Development Workflow
1. Make changes to components or logic
2. Check browser for live updates (Vite hot reload)
3. Use store for state management
4. Run `npm run build` before deployment

## Adding New Features
- New components go in `src/components/`
- New API integrations in `src/api/`
- New code generators in `src/generator/`
- Update types in `src/types/index.ts`

## Common Tasks

### Add a New Framework
1. Update `CodeGenerationOptions` type
2. Add generator function in `src/generator/index.ts`
3. Update `generateCode()` switch statement
4. Test with sample designs

### Debug Design Analysis
1. Check console for API errors
2. Verify Claude API key is valid
3. Test with clear, well-structured designs
4. Check image size (minimum 400x300px)

### Customize Code Output
1. Modify generator functions in `src/generator/index.ts`
2. Change templates or add custom formatting
3. Test generated code in target frameworks

## Deployment
1. Run `npm run build` to create production build
2. Deploy `dist/` folder to web server
3. Set environment variables in production
4. Verify API keys are secure and limited in scope

## Performance Considerations
- Image analysis is CPU-intensive; use reasonable image sizes
- Cache API responses when appropriate
- Lazy load components if list grows
- Monitor bundle size with Vite analysis

## Testing
- Test with various design images
- Verify code generation for each framework
- Check responsive behavior on different screen sizes
- Test error handling with invalid inputs

## Troubleshooting
- Clear `.env.local` cache if API keys change
- Check browser console for detailed errors
- Verify API quotas haven't been exceeded
- Test with simple designs first
