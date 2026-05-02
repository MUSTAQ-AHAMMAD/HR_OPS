# HR Operations Platform

Enterprise-grade HR operations management system with AI-powered template management, brand consistency tools, and seamless employee data synchronization.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality

- **🏢 Brand Management**
  - Create and manage multiple brands
  - Custom branding (colors, logos, assets)
  - Brand asset library
  - WCAG-compliant color contrast checking

- **📄 Template Management**
  - AI-powered template creation
  - Version control for templates
  - Template categorization and tagging
  - Grammar and content suggestions via OpenAI
  - Template publishing workflow

- **👥 Employee Management**
  - Microsoft Outlook integration
  - Automatic employee data synchronization
  - Department-based filtering
  - Employee search functionality

- **📊 Analytics & Reporting**
  - Usage statistics dashboard
  - Activity logs and audit trails
  - Real-time metrics
  - Customizable date ranges

### Design System

- **🎨 Dynamic Theming**
  - CSS custom properties for easy customization
  - Light and dark mode support
  - Accessible color palettes (WCAG AAA)
  - Consistent spacing and typography scales

- **🧩 UI Components**
  - Toast notifications
  - Modal dialogs
  - Drawer panels
  - Loading states and skeleton screens
  - Error boundaries with fallback UI

- **📱 Responsive Design**
  - Mobile-first approach
  - Breakpoints for all device sizes
  - Touch-friendly interfaces

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **UI**: Custom components with Lucide icons
- **State Management**: React hooks
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Authentication**: bcrypt, NextAuth (planned)
- **AI Integration**: OpenAI API

### Development
- **Code Quality**: ESLint, Prettier
- **Type Safety**: TypeScript strict mode
- **Package Manager**: npm 9+

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 14 or higher
- npm 9.0 or higher

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/MUSTAQ-AHAMMAD/HR_OPS.git
cd HR_OPS
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Set up the database**

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

5. **Start the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

```
Email: admin@hrops.com
Password: Admin@123
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Database

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hr_ops?schema=public"
```

### Authentication

```env
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### OpenAI API (for AI features)

```env
OPENAI_API_KEY="sk-your-openai-api-key"
```

### Microsoft Graph API (for Outlook sync)

```env
AZURE_AD_CLIENT_ID="your-azure-app-client-id"
AZURE_AD_CLIENT_SECRET="your-azure-app-client-secret"
AZURE_AD_TENANT_ID="your-azure-tenant-id"
```

### Application

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="HR Operations Platform"
```

### Optional Configuration

```env
# File Upload
MAX_FILE_SIZE_MB=10
UPLOAD_DIR="./public/uploads"

# Security
BCRYPT_ROUNDS=12
SESSION_MAX_AGE=2592000

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

## 🗄 Database Setup

### Schema Overview

The database includes the following main tables:

- **users** - User accounts and authentication
- **user_permissions** - Granular permission management
- **brands** - Brand information and styling
- **brand_assets** - Brand-related files and images
- **templates** - Email/document templates
- **template_versions** - Version history for templates
- **employees** - Cached employee data from Outlook
- **activity_logs** - Audit trail of all actions
- **analytics_events** - Event tracking for analytics

### Running Migrations

```bash
# Create a new migration
npm run db:migrate

# Push schema changes (development only)
npm run db:push

# Open Prisma Studio to view/edit data
npm run db:studio
```

### Seeding Data

The seed script creates:
- Admin user (admin@hrops.com)
- Sample brand (Acme Corporation)
- Sample template (Welcome Email)
- 3 sample employees

```bash
npm run db:seed
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

#### POST `/api/auth/login`
Authenticate a user.

**Request Body:**
```json
{
  "email": "admin@hrops.com",
  "password": "Admin@123"
}
```

### Brand Endpoints

#### GET `/api/brands`
Get all brands with pagination.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

#### POST `/api/brands`
Create a new brand.

**Request Body:**
```json
{
  "name": "My Brand",
  "description": "Brand description",
  "primaryColor": "#3b82f6",
  "secondaryColor": "#64748b",
  "createdById": "user-id"
}
```

#### GET `/api/brands/[id]`
Get a single brand by ID.

#### PUT `/api/brands/[id]`
Update a brand.

#### DELETE `/api/brands/[id]`
Delete a brand (soft delete).

### Template Endpoints

#### GET `/api/templates`
Get all templates with filtering.

**Query Parameters:**
- `page`, `limit` - Pagination
- `status` - Filter by status (DRAFT, PUBLISHED, ARCHIVED)
- `category` - Filter by category
- `brandId` - Filter by brand

#### POST `/api/templates`
Create a new template.

### Employee Endpoints

#### GET `/api/employees`
Get all employees.

**Query Parameters:**
- `page`, `limit` - Pagination
- `department` - Filter by department
- `search` - Search by name or email

#### POST `/api/employees`
Create or update employee (sync endpoint).

### AI Endpoints

#### POST `/api/ai/grammar`
Check grammar and get AI suggestions.

**Request Body:**
```json
{
  "text": "Your text to check"
}
```

**Response:**
```json
{
  "correctedText": "Corrected text",
  "suggestions": [...],
  "score": 95
}
```

### Analytics Endpoints

#### GET `/api/analytics`
Get usage statistics.

**Query Parameters:**
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

## 📁 Project Structure

```
HR_OPS/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/
│   │   │   ├── brands/
│   │   │   ├── templates/
│   │   │   ├── employees/
│   │   │   ├── ai/
│   │   │   └── analytics/
│   │   ├── dashboard/     # Dashboard page
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   ├── ui/            # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── providers/     # Context providers
│   │   └── ErrorBoundary.tsx
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client
│   │   ├── utils.ts       # Utility functions
│   │   ├── validations.ts # Zod schemas
│   │   └── api-utils.ts   # API helpers
│   └── styles/
│       ├── globals.css    # Global styles
│       └── theme.css      # CSS custom properties
├── .env.example           # Environment variables template
├── .eslintrc.json         # ESLint configuration
├── .prettierrc.json       # Prettier configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 🎨 Design System

### CSS Custom Properties

The application uses CSS custom properties for theming:

```css
:root {
  /* Primary colors */
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;

  /* Spacing scale */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Typography */
  --font-size-base: 1rem;
  --line-height-base: 1.5rem;

  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### Color Palette

- **Primary**: Blue (#3b82f6) - Main actions, links
- **Secondary**: Gray (#64748b) - Text, borders
- **Success**: Green (#22c55e) - Success states
- **Warning**: Amber (#f59e0b) - Warnings
- **Error**: Red (#ef4444) - Errors, danger
- **Info**: Blue (#3b82f6) - Information

### Typography Scale

- **Display**: 36px - Page headers
- **Heading 1**: 30px - Section headers
- **Heading 2**: 24px - Card headers
- **Heading 3**: 20px - Small headers
- **Body**: 16px - Default text
- **Small**: 14px - Helper text
- **Tiny**: 12px - Labels

### Spacing Scale (8px base)

- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px
- **3XL**: 64px

## 🔒 Security

### Implemented Security Measures

1. **Authentication**
   - Password hashing with bcrypt (12 rounds)
   - Secure session management
   - Email validation

2. **Input Validation**
   - Zod schema validation
   - XSS prevention via input sanitization
   - SQL injection prevention via Prisma

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Security headers (CSP, X-Frame-Options, etc.)

4. **Data Protection**
   - Sensitive data encryption
   - Secure password requirements
   - Activity logging for audit trails

5. **Best Practices**
   - TypeScript strict mode
   - Environment variable validation
   - Error handling and logging
   - HTTPS enforcement (production)

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker

```bash
# Build image
docker build -t hr-ops .

# Run container
docker run -p 3000:3000 --env-file .env hr-ops
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Environment Requirements

- Node.js 18+ runtime
- PostgreSQL database
- Environment variables configured
- HTTPS enabled (production)

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `npm run format` before committing
- Ensure `npm run lint` passes
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- OpenAI for AI capabilities
- Microsoft for Graph API integration

## 📧 Support

For support, email support@hrops.com or open an issue on GitHub.

## 🗺 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced AI template generation
- [ ] Mobile applications (iOS/Android)
- [ ] Integration with more HR systems
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Custom workflow builder
- [ ] API rate limiting dashboard

## 📸 Screenshots

For detailed screenshots and UI descriptions, see [SCREENSHOTS.md](./SCREENSHOTS.md)

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**