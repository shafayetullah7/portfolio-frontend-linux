export default function NotFound() {
  return (
    <main class="flex min-h-screen flex-col items-center justify-center gap-2 bg-bf-bg text-bf-text">
      <h1 class="text-heading">404</h1>
      <p class="text-caption">Route not found.</p>
      <a href="/" class="text-body text-bf-accent">
        ./home
      </a>
    </main>
  );
}
