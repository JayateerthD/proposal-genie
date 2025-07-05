import React from 'react';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <nav className="flex items-center space-x-4">
            <a href="/dashboard" className="font-bold">Dashboard</a>
            <a href="/editor" className="text-muted-foreground">Editor</a>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-8">
        {children}
      </main>
    </div>
  );
}