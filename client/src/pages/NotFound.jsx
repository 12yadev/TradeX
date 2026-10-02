import EmptyState from '../components/EmptyState';

export default function NotFound() {
  return <div className="container py-5"><EmptyState title="Page not found" text="The page you are looking for does not exist." actionLabel="Go to dashboard" to="/dashboard" /></div>;
}
