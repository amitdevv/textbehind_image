# Text Behind Image

![text-behind-image](https://github.com/user-attachments/assets/d948fda3-1d17-4c5e-9d73-4623eeb2e946)


A free, open-source web application that allows you to create stunning text-behind-image effects with AI-powered background removal.

## Features

- **AI Background Removal**: Automatically remove image backgrounds using @imgly/background-removal
- **Advanced Text Customization**: 
  - Multiple text layers with individual controls
  - Custom fonts, colors, and sizes
  - 3D effects (rotation, tilt, perspective)
  - Shadow effects and opacity controls
  - Letter spacing adjustments
- **Real-time Preview**: See your changes instantly
- **High-Quality Export**: Download your creations as PNG images
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Toggle between themes
- **Completely Free**: No registration, limits, or premium features

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Background Removal**: @imgly/background-removal
- **Image Processing**: HTML5 Canvas
- **Analytics**: Vercel Analytics & Speed Insights

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/text-behind-image.git
cd text-behind-image
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
text-behind-image/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main editor page
│   ├── globals.css        # Global styles
│   └── fonts.css          # Custom font definitions
├── components/            # React components
│   ├── editor/           # Editor-specific components
│   │   ├── font-picker.tsx
│   │   └── text-customizer.tsx
│   ├── ui/               # Reusable UI components
│   └── mode-toggle.tsx   # Theme switcher
├── hooks/                # Custom React hooks
│   └── useUser.tsx       # User context hook
├── providers/            # Context providers
│   └── SupabaseProvider.tsx # Simple provider (no auth)
├── lib/                  # Utility functions
└── constants/            # App constants
```

## Usage

1. **Upload an Image**: Click "Upload image" to select your background image
2. **Wait for Processing**: The AI will automatically remove the background (10-30 seconds)
3. **Add Text**: Click "Add Text" to create text layers
4. **Customize**: Use the controls to adjust fonts, colors, effects, and positioning
5. **Export**: Click "Save image" to download your creation

## Key Features Explained

### Background Removal
- Uses advanced AI model for high-quality background removal
- Processes images locally in the browser for privacy
- Supports various image formats

### Text Customization
- **Typography**: 20+ fonts including Google Fonts
- **3D Effects**: Rotation, tilt X/Y for depth
- **Visual Effects**: Shadows, opacity, letter spacing
- **Positioning**: Drag and position text anywhere
- **Multiple Layers**: Add unlimited text layers

### Export Options
- High-resolution PNG output
- Maintains original image quality
- Canvas-based rendering for precision

## Deployment

The app is ready for deployment on any modern hosting platform:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Build for Production
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Support

If you find this tool helpful, consider supporting its development:

- Star this repository ⭐
- Share with others 📢
- Contribute to the codebase 🛠️
- Buy us a coffee ☕

## Acknowledgments

- [@imgly/background-removal](https://github.com/imgly/background-removal-js) for the AI background removal
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework

---

**Note**: This is a free, open-source alternative to paid text-behind-image tools. No registration required, no limits, completely free to use!
