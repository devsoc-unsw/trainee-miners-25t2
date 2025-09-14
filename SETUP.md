# Formify - Voice-Powered Form Builder

A modern, voice-powered form building application built with Next.js, tRPC, Prisma, and NextAuth.js.

## Features

- 🎤 Voice-powered form filling (coming soon)
- 📝 Drag-and-drop form builder
- 📋 Pre-built form templates
- 🔐 Google OAuth authentication
- 💾 Database storage with Prisma
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trainee-miners-25t2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables in `.env.local`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/formify"
   AUTH_SECRET="your-auth-secret-here"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   ```

4. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret to your `.env.local`

5. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Run database migrations
   pnpm db:push
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Usage

### Authentication
1. Visit the application homepage
2. Click "Login" to sign in with Google
3. After authentication, you'll be redirected to the form builder

### Creating Forms
1. Choose from pre-built templates or start from scratch
2. Use the drag-and-drop interface to add and configure form fields
3. Preview your form before saving
4. Save forms to your account for later use

### Form Templates
The application includes several pre-built templates:
- Contact Forms
- Event Registration
- Job Applications
- Customer Feedback
- Research Surveys

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── form/              # Form builder page
│   ├── login/             # Authentication pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form-specific components
│   └── auth/             # Authentication components
├── lib/                   # Utility libraries
├── server/               # Backend logic
│   ├── api/              # tRPC routers
│   └── auth/             # Authentication configuration
└── styles/               # Global styles
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **UI Components**: Custom components with class-variance-authority
- **Icons**: Lucide React

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks

## Database Schema

The application uses the following main models:

- **User**: User accounts and profiles
- **Form**: Form definitions with fields and settings
- **FormResponse**: User responses to forms
- **FormTemplate**: Pre-built form templates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | NextAuth.js secret key | Yes |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | Yes |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists and user has permissions

### Authentication Issues
- Verify Google OAuth credentials
- Check redirect URIs in Google Console
- Ensure AUTH_SECRET is set

### Build Issues
- Clear `.next` folder and rebuild
- Check Node.js version (18+ required)
- Verify all dependencies are installed

## License

This project is licensed under the MIT License.
