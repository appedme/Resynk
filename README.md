# 🎯 Resync - AI-Powered Resume Builder

Transform your career with smart, ATS-optimized resumes that actually get noticed.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-orange)](https://workers.cloudflare.com/)

## 🚀 Overview

Resync is the world's first AI-powered resume builder with real-time ATS scoring. Built with modern technologies and designed for the mobile-first generation of job seekers.

### ✨ Key Features

- **🤖 AI Content Generation**: Smart suggestions for bullet points and descriptions
- **📊 Real-time ATS Scoring**: Live feedback on resume compatibility
- **🎨 Modern Templates**: Professional, ATS-friendly designs
- **📱 Mobile-First Design**: Seamless editing across all devices
- **☁️ Cloud Sync**: Save and access resumes anywhere
- **🔐 Secure Authentication**: Protected user data with Stack Auth
- **📄 PDF Export**: High-quality PDF generation with perfect formatting
- **🎯 Template Gallery**: 50+ professional templates for all industries

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

### Backend & Infrastructure
- **Cloudflare Workers** - Edge computing for global performance
- **D1 Database** - Serverless SQLite database
- **Drizzle ORM** - Type-safe database operations
- **Stack Auth** - Secure authentication system
- **OpenAI GPT-4** - AI content generation

### Development Tools
- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for quality control
- **pnpm** - Fast, disk space efficient package manager

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- pnpm (recommended) or npm
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/appedme/resync.git
cd resync

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Set up the database
pnpm db:setup

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your-d1-database-url"

# Authentication
STACK_AUTH_SECRET="your-stack-auth-secret"
STACK_AUTH_PROJECT_ID="your-stack-auth-project-id"

# AI Integration
OPENAI_API_KEY="your-openai-api-key"

# Cloudflare
CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
```

## 📖 Documentation

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── editor/            # Resume editor
│   └── ...
├── components/            # React components
│   ├── editor/           # Editor-specific components
│   ├── landing/          # Landing page components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions and configurations
│   ├── db/               # Database schema and operations
│   ├── auth/             # Authentication logic
│   └── utils/            # Helper functions
├── types/                 # TypeScript type definitions
└── hooks/                # Custom React hooks
```

### Database Schema

The application uses Drizzle ORM with the following main tables:

- `users` - User account information
- `resumes` - Resume data and metadata
- `templates` - Resume template definitions

### API Routes

- `GET /api/resumes` - Fetch user resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/generate-pdf` - Generate PDF from resume data

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript checks

# Database
pnpm db:generate      # Generate database migrations
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed database with sample data

# Deployment
pnpm deploy           # Deploy to Cloudflare
pnpm preview          # Preview deployment locally
```

### Adding New Features

1. **Create Components**: Add new React components in `src/components/`
2. **Define Types**: Add TypeScript types in `src/types/`
3. **Add API Routes**: Create new API endpoints in `src/app/api/`
4. **Database Changes**: Update schema in `src/lib/db/schema.ts`
5. **Tests**: Add tests in `__tests__/` directory

## 📱 Mobile Development

Resync is built mobile-first with:

- Responsive design that works on all screen sizes
- Touch-optimized interface
- Progressive Web App (PWA) capabilities
- Offline functionality for core features

## 🔧 Configuration

### Customizing Templates

Templates are defined in `src/components/editor/templates/`. To add a new template:

1. Create a new template component
2. Add it to the template registry
3. Update the database with template metadata
4. Add preview images and descriptions

### AI Integration

The AI features use OpenAI's GPT-4 API. Configure the prompts and behavior in:

- `src/lib/ai/` - AI service functions
- `src/app/api/ai/` - AI API endpoints

## 🚀 Deployment

### Cloudflare Pages

```bash
# Build and deploy
pnpm deploy

# Preview deployment
pnpm preview
```

### Environment Setup

1. Set up Cloudflare D1 database
2. Configure environment variables in Cloudflare dashboard
3. Set up custom domain (optional)
4. Configure analytics and monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and conventions
- Run `pnpm lint` before submitting
- Add tests for new features

## 📊 Performance

- **Load Time**: Sub-second page loads with edge computing
- **Bundle Size**: Optimized for minimal JavaScript delivery
- **SEO**: Server-side rendering for better search visibility
- **Accessibility**: WCAG 2.1 AA compliant

## 🔒 Security

- **Authentication**: Secure JWT-based authentication
- **Data Protection**: Encrypted data storage
- **GDPR Compliance**: User data privacy controls
- **Rate Limiting**: API protection against abuse

## 📈 Analytics & Monitoring

- **Error Tracking**: Comprehensive error monitoring
- **Performance Monitoring**: Real-time performance metrics
- **User Analytics**: Privacy-focused usage analytics
- **Uptime Monitoring**: 99.9% uptime SLA

## 🆘 Support

### Getting Help

- **Documentation**: Check our [docs](./docs/) folder
- **Issues**: Report bugs on [GitHub Issues](https://github.com/appedme/resync/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/appedme/resync/discussions)
- **Email**: Contact us at hello@resync.app

### FAQ

**Q: How do I reset my database?**
A: Run `pnpm db:reset` to reset your local database.

**Q: Can I use this commercially?**
A: Yes, see our [license](LICENSE) for details.

**Q: How do I contribute a new template?**
A: See our [template contribution guide](docs/TEMPLATE_GUIDE.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Cloudflare](https://cloudflare.com/) for edge computing infrastructure
- [OpenAI](https://openai.com/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling system
- [Radix UI](https://radix-ui.com/) for accessible components

---

## 🎯 What's Next?

- **Mobile App**: Native iOS and Android applications
- **Advanced AI**: Enhanced content suggestions and optimization
- **Team Features**: Collaboration tools for organizations
- **Integrations**: Connect with job boards and ATS systems

---

**Built with ❤️ by the Resync Team**

[Website](https://resync.app) • [Demo](https://app.resync.dev) • [Documentation](./docs/) • [Support](mailto:hello@resync.app)