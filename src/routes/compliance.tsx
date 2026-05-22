import { PublicLayout } from '../components/layout/PublicLayout';

export const Route = {
  options: {
    component: CompliancePage,
  },
};

function CompliancePage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-6">
        <h1 className="text-4xl font-extrabold text-zinc-900">NITA and TVETA Compliance</h1>
        <p className="text-sm leading-relaxed text-zinc-600">
          JifunzeHub course pathways are organized to resemble department-aligned TVET delivery with assessments, practical assignments, and completion evidence suitable for internal institutional review.
        </p>
        <p className="text-sm leading-relaxed text-zinc-600">
          This demo environment includes certificate generation, learner analytics, and curriculum records to simulate accredited learning operations in a frontend-only deployment.
        </p>
      </div>
    </PublicLayout>
  );
}
