import { PublicLayout } from '../components/layout/PublicLayout';

export const Route = {
  options: {
    component: TermsPage,
  },
};

function TermsPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-6">
        <h1 className="text-4xl font-extrabold text-zinc-900">Terms of Service</h1>
        <p className="text-sm leading-relaxed text-zinc-600">
          This frontend-only LMS simulates enrollment, assessments, analytics, and credential issuance for institutional demos and local deployment scenarios.
        </p>
        <p className="text-sm leading-relaxed text-zinc-600">
          Users are responsible for maintaining device access, safeguarding exported certificates, and following institutional policies for TVET coursework and academic conduct.
        </p>
      </div>
    </PublicLayout>
  );
}
