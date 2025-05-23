# Math GPT

A modern mathematical assistant with both a beautiful Material 3 web interface and a powerful CLI version. Built with React, TypeScript, Material-UI, and powered by Google's Gemini AI.

## Features

### Web Interface
- 🎨 Beautiful Material 3 design with dynamic color support
- 🌓 Light and dark mode with system preference detection
- 💬 Real-time chat interface with markdown support
- 📝 Code block syntax highlighting
- 📱 Responsive design for all screen sizes
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### CLI Version
- 🖥️ Rich terminal interface with colors and formatting
- 📚 Conversation history management
- 🔄 Special commands (clear, history, exit)
- 🎯 Command-line arguments for customization
- 📝 Markdown support in responses

### Shared Features
- 🤖 Powered by Google's Gemini AI for accurate math solutions
- 💡 Step-by-step mathematical explanations
- 🔢 Support for various mathematical concepts
- 📊 Code examples in appropriate programming languages

## Getting Started

### Prerequisites

- Node.js 16.x or later (for web interface)
- npm 7.x or later (for web interface)
- Python 3.8 or later
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/math-gpt.git
cd math-gpt
```

2. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Using the CLI Version

Run the CLI version with:
```bash
python backend/cli.py
```

Optional arguments:
- `--api-key`: Specify your Google Gemini API key
- `--no-history`: Disable conversation history

Example:
```bash
python backend/cli.py --api-key your_api_key_here
```

Special commands in CLI:
- `exit` or `quit`: End the session
- `clear`: Clear conversation history
- `history`: View conversation history

### Using the Web Interface

1. Start the backend server:
```bash
cd backend
python app.py
```

2. In a new terminal, start the frontend:
```bash
cd math-gpt
npm install
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

### Project Structure

```
math-gpt/
├── src/                    # Frontend React code
│   ├── components/
│   │   └── ChatInterface.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── backend/               # Python backend
│   ├── math_gpt_core.py  # Shared core functionality
│   ├── app.py           # Flask web server
│   ├── cli.py           # CLI interface
│   └── requirements.txt
├── public/               # Static assets
└── package.json         # Frontend dependencies
```

### Available Scripts

Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

Backend:
- `python app.py` - Start Flask web server
- `python cli.py` - Run CLI version

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful components
- [React Markdown](https://github.com/remarkjs/react-markdown) for markdown rendering
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) for code highlighting
- [Vite](https://vitejs.dev/) for the fast development experience
- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities
- [Flask](https://flask.palletsprojects.com/) for the Python backend
- [Rich](https://github.com/Textualize/rich) for the beautiful CLI interface 