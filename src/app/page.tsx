import Dashboard from '@/components/dashboard';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Dashboard />
      </main>
    </div>
  );
}
