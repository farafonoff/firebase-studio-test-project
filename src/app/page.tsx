import LearningSession from '@/components/learning-session';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-8 md:p-12">
      <header className="w-full max-w-2xl mb-8 flex items-center gap-4">
        <Logo className="h-10 w-10 text-primary-foreground fill-primary" />
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
          Türkçe Kart
        </h1>
      </header>
      <LearningSession />
    </main>
  );
}
