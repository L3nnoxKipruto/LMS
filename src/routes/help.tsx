import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { HelpCircle, ChevronRight, Laptop, Server, WifiOff } from 'lucide-react';
import { Link as RouterLink } from '@tanstack/react-router';
const Link = RouterLink as any;

export const Route = {
  options: {
    component: HelpCenterPage,
  },
};

function HelpCenterPage() {
  const faqs = [
    {
      q: 'How does JifunzeHub work when there is no internet connection?',
      a: 'We store vital application data inside your browser storage (SQLite/IndexedDB). You can watch downloaded video modules, review blueprints, or take quizzes offline. When you are back on campus near a JifunzeHub Classroom Server, your logs sync instantly.',
      icon: WifiOff
    },
    {
      q: 'What is a Local Classroom Server Node?',
      a: 'It is a lightweight local server (such as a Raspberry Pi or old laptop) placed in your school. It broadcasts the lessons locally, allowing hundreds of tablets to stream high-quality educational videos simultaneously without using internet data.',
      icon: Server
    },
    {
      q: 'How do I download course material to my personal device?',
      a: 'Browse to any Course Preview page, click "Download for Offline Use," and choose the lessons or modules you want to cache. You will see a progress percentage, after which you can access them anytime under "Offline Library."',
      icon: Laptop
    }
  ];

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="info">Support Hub</Badge>
          <h1 className="text-4xl font-extrabold text-zinc-900">Help Center & Resilient FAQs</h1>
          <p className="text-zinc-500">
            Learn how to make the most of JifunzeHub's unique offline capabilities on and off-campus.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-zinc-200 p-6 rounded-2xl bg-white flex gap-4 items-start">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <faq.icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-zinc-900 text-lg">{faq.q}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-blue-600 text-white rounded-2xl p-8 text-center space-y-6 shadow-md">
          <HelpCircle className="h-12 w-12 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Still Need On-Campus Support?</h3>
            <p className="text-sm text-blue-100 max-w-xl mx-auto">
              If your classroom server is down or you need help pairing your device, contact your ICT representative or submit a direct ticket.
            </p>
          </div>
          <Link to="/contact">
            <Button className="bg-white text-blue-600 px-6 py-2.5 hover:bg-zinc-100">Create Support Ticket</Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
