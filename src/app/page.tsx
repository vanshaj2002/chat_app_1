export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to My Application</h1>
          <p className="text-xl mb-8">Your application is now running in production!</p>
          
          <div className="flex justify-center gap-4">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} My Application. All rights reserved.</p>
      </footer>
    </div>
  );
}
