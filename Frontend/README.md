# DSCWoC Frontend

Welcome to the DSCWoC (Developer Student Clubs Winter of Code) Frontend repository! This project serves as the frontend interface for the DSCWoC platform.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

DSCWoC Frontend is a modern web application built to support the Developer Student Clubs Winter of Code program. This platform facilitates student participation in open-source projects during the winter coding season.

## ✨ Features

- **User Authentication**: Secure login and registration system
- **Project Management**: Browse and manage open-source projects
- **Dashboard**: Personalized user dashboard with progress tracking
- **Responsive Design**: Mobile-first, responsive user interface
- **Real-time Updates**: Live notifications and updates
- **Profile Management**: Comprehensive user profile system

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (latest version)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdmGenSameer/DSCWoC-Frontend.git
   cd DSCWoC-Frontend
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit the environment variables
   nano .env.local
   ```

   Required environment variables:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_ENVIRONMENT=development
   REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
   ```

## 🎮 Usage

### Development Server

Start the development server:

```bash
# Using npm
npm start

# Using yarn
yarn start
```

The application will be available at `http://localhost:3000`

### Production Build

Create a production build:

```bash
# Using npm
npm run build

# Using yarn
yarn build
```

### Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📁 Project Structure

```
DSCWoC-Frontend/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── styles/            # CSS/SCSS files
│   ├── contexts/          # React contexts
│   ├── types/             # TypeScript type definitions
│   └── App.js             # Main App component
├── tests/                 # Test files
├── docs/                  # Documentation
├── .env.example          # Environment variables example
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## 🛠️ Development

### Code Style

This project uses ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Git Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run eject` - Eject from Create React App (not recommended)

## 🤝 Contributing

We welcome contributions to the DSCWoC Frontend! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📚 Documentation

- [Component Documentation](./docs/components.md)
- [API Integration Guide](./docs/api-integration.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🐛 Issues

If you encounter any issues, please check the [Issues](https://github.com/AdmGenSameer/DSCWoC-Frontend/issues) page or create a new issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Developer Student Clubs for organizing the Winter of Code
- All contributors who have helped improve this project
- The open-source community for inspiration and tools

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord server: [DSC Community](https://discord.gg/dsc)
- Email: support@dscwoc.dev

---

**Happy Coding! 🚀**

Made with ❤️ by the DSCWoC Team