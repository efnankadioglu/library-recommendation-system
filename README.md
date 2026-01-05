<# Library Recommendation System

An AI-powered library book recommendation system built with React, TypeScript, Tailwind CSS, and AWS serverless architecture. This is a 4-week intensive project for CENG413 Software Quality Standards course.

## 🎯 Project Overview

This project provides a **complete frontend starter** with mock data and comprehensive guides for students to implement the AWS serverless backend. Students will learn:

- Modern React development with TypeScript
- AWS Lambda, DynamoDB, API Gateway
- User authentication with Amazon Cognito
- AI integration with Amazon Bedrock
- Serverless architecture patterns
- Cloud deployment (S3 + CloudFront)

**Current Status**: ✅ Frontend complete with mock data | ⏳ Backend to be implemented by students

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **AI-Powered Recommendations**: Integration-ready for Amazon Bedrock
- **User Authentication**: Prepared for AWS Cognito integration
- **Reading Lists**: Organize and manage book collections
- **Admin Dashboard**: Book management and metrics
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript coverage
- **Testing**: Vitest + React Testing Library setup
- **Code Quality**: ESLint, Prettier, and strict TypeScript configuration

## 📋 Prerequisites

### For Frontend Development (Week 1)

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Git**: For version control

### For AWS Backend Implementation (Week 2-4)

- **AWS Account**: Free Tier eligible
- **AWS CLI**: Installed and configured
- **Basic AWS Knowledge**: Lambda, DynamoDB, API Gateway concepts

## 🚀 Quick Start Guide

### Step 1: Install Node.js (if not installed)

```bash
# Check if Node.js is installed
node --version

# Should show v20.x.x or higher
# If not installed, download from: https://nodejs.org/
```

### Step 2: Install Dependencies

```bash
cd library-recommendation-system
npm install
# This will take 2-3 minutes
```

### Step 3: Start Development Server

```bash
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

### Step 4: Open in Browser

Open http://localhost:5173 in your browser.

You should see the Library Recommendation System homepage! 🎉

---

## 📱 What You're Seeing

Right now, the application is running with **mock data**:

- ✅ Books are loaded from `src/services/mockData.ts`
- ✅ Login/signup is simulated (no real authentication)
- ✅ Reading lists are stored in browser localStorage
- ✅ AI recommendations are fake responses

**This is intentional!** You'll implement the real AWS backend over the next 4 weeks.

### Explore the Application

- Browse books (mock data from `src/services/mockData.ts`)
- Try the login/signup pages (mock authentication)
- Create reading lists (stored in browser)
- Test AI recommendations (mock responses)
- Check the admin panel

---

## 📅 Week-by-Week Goals

### Week 1: Frontend Exploration (5-7 hours)

- ✅ Get the app running (you just did this!)
- ✅ Explore all pages (Books, Recommendations, Reading Lists, Admin)
- ✅ Understand the code structure
- ✅ Create AWS account and set up billing alerts
- ✅ Deploy your first "Hello World" Lambda function

### Week 2: Backend API (8-10 hours)

- ✅ Create DynamoDB tables (Books, ReadingLists)
- ✅ Deploy Lambda functions for Books API
- ✅ Deploy Lambda functions for Reading Lists API
- ✅ Set up API Gateway
- ✅ Connect frontend to real API

### Week 3: Authentication (6-8 hours)

- ✅ Create Cognito User Pool
- ✅ Install and configure AWS Amplify
- ✅ Implement real login/signup
- ✅ Add authentication to API calls
- ✅ Protect API endpoints

### Week 4: AI & Deployment (8-10 hours)

- ✅ Enable Amazon Bedrock
- ✅ Deploy AI recommendations Lambda
- ✅ Deploy frontend to S3 + CloudFront
- ✅ End-to-end testing
- ✅ Final polish and documentation

**See [PROJECT_TIMELINE_4WEEKS.md](../PROJECT_TIMELINE_4WEEKS.md) for detailed weekly breakdown.**

---

## 🛠️ Useful Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Check code quality
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Common First-Time Issues

### Port 5173 Already in Use

```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.ts
```

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

### Styles Not Loading

1. Check that `src/index.css` exists
2. Restart dev server: `Ctrl+C` then `npm run dev`

---

## 📂 Project Structure

```
library-recommendation-system/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Button, Card, Input, Modal, etc.
│   │   ├── layout/       # Header, Footer, Navigation
│   │   └── books/        # BookCard, BookGrid, BookSearch
│   ├── pages/            # Page components (Home, Books, etc.)
│   ├── services/         # API calls and mock data
│   │   ├── api.ts        # ⚠️ TODOs for AWS implementation
│   │   └── mockData.ts   # ⚠️ Mock data (will be replaced)
│   ├── contexts/         # React Context (Auth)
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions
├── public/               # Static assets
├── IMPLEMENTATION_GUIDE.md  # 📖 Step-by-step AWS guide
├── STUDENT_CHECKLIST.md     # ✅ Progress tracking
└── README.md                # This file
```

---

## 🎯 Next Steps

1. ✅ **Explore the app** - Click around, try all features
2. ✅ **Read the code** - Start with `src/App.tsx` and follow the imports
3. ✅ **Check TODOs** - Look at `src/services/api.ts` to see what you'll implement
4. ✅ **Create AWS account** - You'll need this for Week 2
5. ✅ **Read IMPLEMENTATION_GUIDE.md** - Familiarize yourself with Week 1 tasks

---

## 💡 Tips for Success

1. **Start early** - Don't wait until the last day of each week
2. **Test frequently** - Test each Lambda function as you create it
3. **Commit often** - Make small commits with clear messages
4. **Read documentation** - AWS docs are comprehensive and helpful
5. **Work together** - Pair program on complex features
6. **Stay in Free Tier** - Monitor AWS costs to avoid charges
7. **Ask questions** - No question is too simple

---

## 🆘 Getting Help

### Documentation

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed AWS implementation steps
- **[PROJECT_TIMELINE_4WEEKS.md](../PROJECT_TIMELINE_4WEEKS.md)** - Weekly goals and tasks
- **[STUDENT_CHECKLIST.md](./STUDENT_CHECKLIST.md)** - Progress tracking
- **[RESOURCES.md](./RESOURCES.md)** - Links to all official documentation
- **[AWS_FREE_TIER_SETUP.md](../AWS_FREE_TIER_SETUP.md)** - Complete AWS account setup guide

### Code TODOs

Search for `TODO:` in the code to find implementation points:

```bash
grep -r "TODO:" src/
```

### Getting Stuck?

1. Read error messages carefully
2. Check AWS CloudWatch Logs
3. Search the error on Google/Stack Overflow
4. Ask in team chat
5. Use office hours

---

**Ready to implement AWS backend? Check out [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** 🚀

## 📜 Available Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build for production                     |
| `npm run preview`       | Preview production build locally         |
| `npm run lint`          | Run ESLint to check code quality         |
| `npm run format`        | Format code with Prettier                |
| `npm test`              | Run tests in watch mode                  |
| `npm run test:coverage` | Generate test coverage report            |

## 📁 Project Structure

```
frontend/
├── public/
│   └── book-covers/          # Book cover images
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── books/            # Book-specific components
│   │       ├── BookCard.tsx
│   │       ├── BookGrid.tsx
│   │       └── BookSearch.tsx
│   ├── pages/                # Page components
│   │   ├── Home.tsx
│   │   ├── Books.tsx
│   │   ├── BookDetail.tsx
│   │   ├── Recommendations.tsx
│   │   ├── ReadingLists.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Admin.tsx
│   │   └── NotFound.tsx
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/                # Custom hooks
│   │   └── useAuth.ts
│   ├── services/             # API and data services
│   │   ├── api.ts
│   │   └── mockData.ts
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts
│   │   ├── validation.ts
│   │   └── errorHandling.ts
│   ├── tests/                # Test files
│   │   ├── components/
│   │   ├── utils/
│   │   └── setup.ts
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── .vscode/                  # VS Code settings
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 📍 Mock Data & TODOs

### Understanding Mock Data

The application currently uses mock data for development. All mock data is located in:

**`src/services/mockData.ts`** - Contains:

- 10 sample books with realistic data
- Sample users for testing
- Sample reading lists

**`src/services/api.ts`** - Contains:

- Mock API functions that return mock data
- Detailed TODOs for AWS implementation
- Code examples for each endpoint

### Finding TODOs

Search for `TODO:` in these files to find implementation points:

```bash
# Find all TODOs
grep -r "TODO:" src/

# Key files with TODOs:
# - src/services/api.ts (API endpoints)
# - src/contexts/AuthContext.tsx (Cognito authentication)
# - src/services/mockData.ts (data documentation)
```

### Implementation Path

1. **Week 1**: Run frontend with mock data, explore code
2. **Week 2**: Replace Books API TODOs with Lambda functions
3. **Week 3**: Replace Auth TODOs with Cognito integration
4. **Week 4**: Replace Recommendations TODO with Bedrock, deploy frontend

Each TODO includes:

- ✅ What needs to be done
- ✅ Step-by-step instructions
- ✅ Code examples
- ✅ Links to documentation

## 🔧 Configuration Files

### TypeScript (`tsconfig.json`)

- Strict mode enabled
- Path aliases configured (`@/` → `src/`)
- React JSX support

### Vite (`vite.config.ts`)

- Path alias resolution
- Dev server on port 5173
- Optimized production builds
- Code splitting for vendor libraries

### Tailwind CSS (`tailwind.config.js`)

- Custom color palette (primary shades)
- Custom animations (fade-in, slide-up)
- Responsive breakpoints

### ESLint & Prettier

- React and TypeScript rules
- Automatic formatting on save
- Import sorting

## 🎨 UI Components

### Common Components

- **Button**: Variants (primary, secondary, danger), sizes (sm, md, lg)
- **Card**: Hoverable cards with shadow effects
- **Input**: Form inputs with validation and error display
- **Modal**: Accessible modal with backdrop and ESC key support
- **LoadingSpinner**: Animated loading indicator
- **ProtectedRoute**: Route wrapper for authentication

### Layout Components

- **Header**: Responsive navigation with mobile menu
- **Footer**: Copyright and social links
- **Navigation**: Active link styling with React Router

### Book Components

- **BookCard**: Book display with cover, title, author, rating
- **BookGrid**: Responsive grid layout for books
- **BookSearch**: Search and filter interface

## 🔐 Authentication

The app is prepared for AWS Cognito integration. Current implementation uses mock authentication for development.

### To Integrate Cognito:

1. Install AWS Amplify:

```bash
npm install aws-amplify
```

2. Configure in `src/main.tsx`:

```typescript
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  },
});
```

3. Update `src/contexts/AuthContext.tsx` with Cognito methods

See TODO markers in the code for detailed integration steps.

## 🤖 AI Recommendations (Week 4)

The Recommendations page is ready for Amazon Bedrock integration.

### Current Status:

- ✅ Frontend UI complete
- ✅ Mock recommendations working
- ⏳ Bedrock integration (students implement)

### Implementation Steps:

See **IMPLEMENTATION_GUIDE.md - Week 4** for detailed instructions:

1. Enable Bedrock model access (Claude 3 Haiku recommended)
2. Create Lambda function that calls Bedrock
3. Create API Gateway endpoint: POST /recommendations
4. Update `src/services/api.ts` getRecommendations() function
5. Test AI-generated recommendations

**Estimated Cost**: ~$0.01 per recommendation (within Free Tier for testing)

## 🗄️ Backend Integration (Week 2-4)

All API calls in `src/services/api.ts` are currently mocked. Students will implement the AWS backend following **IMPLEMENTATION_GUIDE.md**.

### Implementation Timeline:

**Week 2**: Core API Endpoints

- ✅ `GET /books` - List all books (Lambda + DynamoDB)
- ✅ `GET /books/:id` - Get book details
- ✅ `POST /books` - Create book (admin only)
- ✅ `GET /reading-lists` - Get user's reading lists
- ✅ `POST /reading-lists` - Create reading list
- ✅ `PUT /reading-lists/:id` - Update reading list
- ✅ `DELETE /reading-lists/:id` - Delete reading list

**Week 3**: Authentication

- ✅ Cognito User Pool setup
- ✅ Protected API endpoints
- ✅ JWT token handling

**Week 4**: AI & Deployment

- ✅ `POST /recommendations` - AI recommendations (Bedrock)
- ✅ Frontend deployment (S3 + CloudFront)

### How to Implement:

1. **Follow IMPLEMENTATION_GUIDE.md** - Step-by-step instructions for each week
2. **Check TODOs in code** - Each function has detailed implementation notes
3. **Test as you go** - Use curl to test each endpoint
4. **Ask for help** - Use office hours if stuck

### Environment Variables:

After deploying your backend, update `.env`:

```env
VITE_API_BASE_URL=https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/dev
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXX
VITE_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Test Structure

- Component tests in `src/tests/components/`
- Utility tests in `src/tests/utils/`
- Test setup in `src/tests/setup.ts`

Current coverage: ~75% (meets Milestone 3 requirement)

## 🚀 Deployment (Week 4)

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Deploy to AWS S3 + CloudFront

Students will deploy the frontend following **IMPLEMENTATION_GUIDE.md - Week 4, Day 3-4**:

1. **Create S3 bucket** for static website hosting
2. **Upload build files** to S3
3. **Create CloudFront distribution** (optional but recommended)
4. **Configure CORS** in API Gateway for your domain
5. **Test production deployment**

### Deployment Commands:

```bash
# Build production version
npm run build

# Upload to S3 (after creating bucket)
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Your site will be available at:
# http://your-bucket-name.s3-website-us-east-1.amazonaws.com
# or https://your-cloudfront-url.cloudfront.net
```

### Cost Estimate:

- **S3 Storage**: Free (within 5GB Free Tier)
- **CloudFront**: Free (within 1TB transfer Free Tier)
- **Total**: $0/month for typical student project usage

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.ts
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

### Tailwind Styles Not Applying

1. Check that `index.css` imports Tailwind directives
2. Verify `tailwind.config.js` content paths
3. Restart dev server

## 📚 Project Documentation

### For Students

- **[README.md](./README.md)** - This file - Quick start guide (START HERE!)
- **[AWS_FREE_TIER_SETUP.md](../AWS_FREE_TIER_SETUP.md)** - AWS account creation guide (root directory)
- **[PROJECT_TIMELINE_4WEEKS.md](../PROJECT_TIMELINE_4WEEKS.md)** - Weekly goals and timeline (root directory)
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step AWS implementation
- **[STUDENT_CHECKLIST.md](./STUDENT_CHECKLIST.md)** - Progress tracking checklist
- **[RESOURCES.md](./RESOURCES.md)** - All official documentation links

### Code Documentation

- **src/services/mockData.ts** - Mock data with detailed documentation
- **src/services/api.ts** - API functions with TODOs for AWS implementation
- **src/contexts/AuthContext.tsx** - Authentication with TODOs for Cognito

### External Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [AWS Lambda Guide](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Guide](https://docs.aws.amazon.com/dynamodb/)
- [Cognito Guide](https://docs.aws.amazon.com/cognito/)
- [Bedrock Guide](https://docs.aws.amazon.com/bedrock/)

## 🎓 Learning Objectives

By completing this project, students will:

- ✅ Build production-ready React applications with TypeScript
- ✅ Implement serverless architecture with AWS Lambda
- ✅ Design NoSQL databases with DynamoDB
- ✅ Secure applications with Cognito authentication
- ✅ Integrate AI/ML services with Amazon Bedrock
- ✅ Deploy full-stack applications to AWS
- ✅ Follow software quality standards and best practices
- ✅ Work in agile teams with version control

## 🤝 Contributing

This is a student project for CENG413 Software Quality Standards course. Follow the project guidelines and coding standards defined in `.kiro/steering/` files.

## 📄 License

This project is part of an academic course at Istanbul Okan University.

---

**Built with ❤️ for CENG413 - Software Quality Standards**

**Project Type**: 4-week intensive, beginner-friendly, AWS serverless  
**Status**: Frontend complete ✅ | Backend implementation guides ready ✅  
**Next Step**: [QUICK_START.md](./QUICK_START.md) 🚀

DOCUMENTATION

📡 API Endpoints
The backend is built using AWS API Gateway and Lambda.Base

🏗️ Architecture
This project utilizes a Serverless Microservices Architecture on AWS.
graph TD
Code Snippet:
    User[User / Browser]
    
    subgraph "Frontend Hosting"
        CF[CloudFront CDN]
        S3[S3 Bucket]
    end
    
    subgraph "Authentication"
        Cognito[Amazon Cognito]
    end
    
    subgraph "Backend Services"
        APIG[API Gateway]
        
        subgraph "Compute (Lambda)"
            Fn_Books[Get Books]
            Fn_Lists[Manage Lists]
            Fn_AI[AI Recommendation]
        end
        
        DB[(DynamoDB)]
        Bedrock[Amazon Bedrock]
    end

    %% Data Flow
    User -->|HTTPS Request| CF
    CF --> S3
    User -->|Auth / Token| Cognito
    User -->|API REST Calls| APIG
    
    APIG --> Fn_Books
    APIG --> Fn_Lists
    APIG --> Fn_AI
    
    Fn_Books <--> DB
    Fn_Lists <--> DB
    Fn_AI -->|Prompt Engineering| Bedrock
    ⚙️ Setup Instructions
Follow these steps to run the project locally.

1. Clone the Repository
Bash

git clone https://github.com/efnankadioglu/library-recommendation-system.git
cd library-recommendation-system
2. Install Dependencies
Bash

npm install
3. Configure Environment Variables
Create a .env file in the root directory and add your AWS credentials/endpoints:

Code Snippet

VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxx
4. Run Locally
Bash

npm run dev
The app will start at http://localhost:5173.

👥 Team Contributions
This project was developed by the CENG413 Team using Agile methodologies.

Team Member,Primary Roles & Contributions

Efnan Büşra Kadıoğlu,"Full Stack / Frontend LeadUI/UX Implementation, React Architecture, Component Design."

Sıla Yeşilyurt,"Backend / AWS LambdaAPI Gateway setup, Lambda function implementation, Integration testing."

Şevval Ekin Tokgöz,"Database / DynamoDBNoSQL Data modeling, Table configuration, Data consistency checks."

Mehmet Konuralp Hekimbaşı,"Coverage Testing, Documentation, Presentation."
