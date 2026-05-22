import { PublicLayout } from '../components/layout/PublicLayout';

export const Route = {
  options: {
    component: PrivacyPage,
  },
};

function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-6">
        <h1 className="text-4xl font-extrabold text-zinc-900">Privacy Policy</h1>
        <p className="text-sm leading-relaxed text-zinc-600">
          JifunzeHub stores course activity, support tickets, notes, and settings locally in your browser using localStorage and IndexedDB. Demo data remains on-device unless explicitly synced to the simulated campus node.
        </p>
        <p className="text-sm leading-relaxed text-zinc-600">
          Profile details, lesson completion, bookmarks, quiz history, and certificates are persisted to create a realistic SaaS learning experience without a backend.
        </p>
      </div>
    </PublicLayout>
  );
}
