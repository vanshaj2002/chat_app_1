# Real-Time Chat Application

A modern, real-time chat application built with Next.js, TypeScript, Tailwind CSS, and Supabase. This application provides a seamless messaging experience with real-time updates, user authentication, and a responsive design.

## ✨ Features

- **User Authentication**
  - Secure sign up and login with email/password
  - Protected routes with middleware
  - Session management

- **Real-time Messaging**
  - Instant message delivery
  - Read receipts
  - Typing indicators
  - Message history

- **User Interface**
  - Responsive design for all devices
  - Dark/Light mode support
  - Modern and intuitive interface
  - Loading states and error handling

- **Chat Features**
  - One-on-one conversations
  - Message status (sent, delivered, read)
  - Timestamps for messages
  - Smooth scrolling

## 🚀 Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication & Database**: Supabase
- **Real-time Updates**: Supabase Realtime
- **Icons**: React Icons (Feather Icons)
- **Form Handling**: React Hook Form
- **Type Checking**: TypeScript
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Supabase account (free tier available)
- Git

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/himanshu102003/SDE-1.git
cd SDE-1
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 Supabase Setup

1. **Create a New Project**
   - Go to [Supabase](https://supabase.com/) and create a new project
   - Wait for your database to be ready

2. **Set Up Database Tables**
   - Navigate to the SQL Editor in Supabase
   - Create the necessary tables using the SQL from `supabase/migrations/`

3. **Configure Authentication**
   - Go to Authentication > Providers
   - Enable "Email" provider
   - Configure site URL (e.g., http://localhost:3000 for development)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel app URL)
4. Deploy!

### Other Platforms
You can also deploy to Netlify, AWS Amplify, or any other platform that supports Next.js applications.

## 📂 Project Structure

```
src/
├── app/                    # App router pages
│   ├── dashboard/          # Main chat interface
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── layout.tsx          # Root layout
├── components/            # Reusable UI components
│   ├── Chat/              # Chat components
│   │   ├── ChatList.tsx   # List of conversations
│   │   ├── Message.tsx    # Individual message component
│   │   └── index.tsx      # Main chat interface
│   └── common/            # Common components
├── hooks/                 # Custom React hooks
│   └── useChat.ts         # Chat functionality hook
├── lib/                   # Utility functions
│   └── supabase/          # Supabase client configuration
└── types/                 # TypeScript type definitions
```

## 🚀 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js and Vercel for the amazing framework
- Supabase for the awesome backend services
- The open-source community for valuable packages and resources
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
