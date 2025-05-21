# Chat Application

A real-time chat application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- User authentication (sign up, login, logout)
- Real-time messaging
- Responsive design
- Chat list with unread message indicators
- Message read receipts
- Online/offline status
- Group chats
- File attachments
- Emoji support

## Tech Stack

- **Frontend**: Next.js 13 with App Router
- **Styling**: Tailwind CSS
- **Database & Authentication**: Supabase
- **Real-time**: Supabase Realtime
- **Icons**: React Icons
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new project in Supabase
2. Run the SQL from `supabase/migrations/20230521000000_create_tables.sql` in the SQL editor
3. Run the SQL from `supabase/init.sql` to set up functions and triggers

## Project Structure

```
src/
├── app/                    # App router pages
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   └── signup/             # Signup page
├── components/             # Reusable components
│   └── Chat/               # Chat component
├── hooks/                  # Custom hooks
├── lib/                    # Utility functions
│   └── supabase/           # Supabase client configuration
├── types/                  # TypeScript type definitions
└── styles/                 # Global styles
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
