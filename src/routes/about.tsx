import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Badge } from '../components/ui/Badge';
import { GraduationCap, ShieldCheck, Cpu, Database } from 'lucide-react';

export const Route = {
  options: {
    component: AboutPage,
  },
};

function AboutPage() {
  return (
    <PublicLayout>
      <div className="py-16 md:py-24 bg-gradient-to-b from-blue-50/30 to-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Badge variant="info" className="px-3 py-1">Our Resilient Mission</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900">
            Bridging the Digital Divide in Vocational Education
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed">
            Technical and Vocational Education and Training (TVET) is highly practical. However, expensive internet bundles, unstable grid networks, and frequent packet losses shouldn't block access to digital lectures, wiring tutorials, and lab worksheets.
          </p>
        </div>
      </div>

      <section className="py-12 bg-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-zinc-100 p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Offline-First Native Design</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Every course module, slide, and assessment question is loaded directly into the client database cache (SQLite/IndexedDB). You can complete coursework, write code, or draft layouts while completely isolated in remote areas.
            </p>
          </div>

          <div className="border border-zinc-100 p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Local Micro-Servers</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We leverage low-cost campus micro-servers that store terabytes of detailed engineering video walk-throughs. Students can pull resources directly inside the classroom at gigabit speeds without drawing cellular data.
            </p>
          </div>

          <div className="border border-zinc-100 p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">TVETA Syllabus Aligned</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Our course architecture maps explicitly to the official TVET Authority (TVETA) and National Industrial Training Authority (NITA) syllabus guidelines, preparing students directly for national licensing exam procedures.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership / Origin Section */}
      <section className="py-16 bg-zinc-50 transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="text-3xl font-bold text-zinc-900">Formulated for Institutional Resilience</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Originally ideated in Nairobi, Kenya, JifunzeHub is built on the belief that digital empowerment must not be gated behind expensive subscription services or reliable grids. By designing for the most challenging connectivity contexts, we create software that is incredibly resilient, fast, and accessible for everyone, anywhere on the continent.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
