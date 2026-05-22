import React from 'react';
import { Certificate } from '../../types';
import logoUrl from '../../assets/logo.png';
import { Award, Download, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface CertificateCardProps {
  certificate: Certificate;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const handlePrint = () => {
    const printContent = document.getElementById(`print-cert-${certificate.id}`);
    if (!printContent) return;
    
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const printWindow = window.open(windowUrl, uniqueName.toString(), 'left=50,top=50,width=900,height=650,toolbar=0,scrollbars=1,status=0');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Graduation Certificate - ${certificate.courseTitle}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body { -webkit-print-color-adjust: exact; }
                .no-print { display: none; }
              }
              body { font-family: 'Outfit', sans-serif; }
            </style>
          </head>
          <body class="bg-white p-8">
            ${printContent.innerHTML}
            <div class="text-center mt-6 no-print">
              <button onclick="window.print();" class="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">Trigger Print / Save PDF</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
      
      {/* Hidden Printable Frame Container */}
      <div id={`print-cert-${certificate.id}`} className="hidden">
        <div className="border-8 border-double border-indigo-600 p-8 max-w-4xl mx-auto bg-gradient-to-br from-indigo-50/10 via-white to-indigo-50/10 text-zinc-900 relative shadow-inner">
          
          {/* Certificate Header watermark decoration */}
          <div className="absolute top-4 left-4 text-xs font-bold text-zinc-400">JIFUNZEHUB ACADEMY</div>
          <div className="absolute top-4 right-4 text-xs font-bold text-zinc-400">TVET COMPLIANT</div>

          <div className="text-center space-y-6">
            <div className="flex justify-center mb-2">
              <img src={logoUrl} className="h-12 w-auto filter grayscale opacity-90" alt="JifunzeHub Logo" />
            </div>
            
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-650">CERTIFICATE OF gradUATE EXCELLENCE</span>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">DENNIS KIPROP</h1>
              <div className="h-0.5 w-40 bg-indigo-600 mx-auto" />
            </div>

            <p className="text-sm max-w-lg mx-auto leading-relaxed text-zinc-650">
              has completed all course requirements, practical diagnostics, workshops, and final modular reviews for the course:
            </p>

            <h2 className="text-2xl font-extrabold text-indigo-700 tracking-tight">{certificate.courseTitle}</h2>

            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto pt-6 border-t border-zinc-200 text-left">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">ISSUE DATE</span>
                <span className="text-xs font-bold text-zinc-850">{new Date(certificate.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">GRADE</span>
                <span className="text-lg font-black text-indigo-600">{certificate.grade}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase">VERIFICATION CODE</span>
                <span className="text-xs font-mono font-bold text-zinc-850">{certificate.verificationCode}</span>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center max-w-xl mx-auto">
              <div className="border-t border-zinc-450 w-44 pt-1.5 text-center">
                <span className="text-xs font-bold block text-zinc-850">System Registrar</span>
                <span className="text-[9px] text-zinc-400 block">JifunzeHub Platform</span>
              </div>
              <div className="border-t border-zinc-450 w-44 pt-1.5 text-center">
                <span className="text-xs font-bold block text-zinc-850">Dr. Sarah Mitchell</span>
                <span className="text-[9px] text-zinc-400 block">TVETA Board Advisor</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Screen Card UI Display */}
      <div className="flex gap-4 items-start">
        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
          <Award className="h-5 w-5" />
        </div>
        <div className="flex-grow space-y-1 truncate">
          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 truncate">{certificate.courseTitle}</h4>
          <p className="text-[10px] text-zinc-400">Issued: {new Date(certificate.issueDate).toLocaleDateString()} • Grade: {certificate.grade}</p>
          <div className="flex items-center gap-1.5 pt-1 text-[10px] font-semibold text-emerald-650 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified: {certificate.verificationCode}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handlePrint}
          className="w-full justify-center text-xs py-1 flex items-center gap-1 font-bold"
        >
          <Download className="h-3.5 w-3.5" />
          <span>View / Export PDF</span>
        </Button>
      </div>

    </div>
  );
};
export default CertificateCard;
