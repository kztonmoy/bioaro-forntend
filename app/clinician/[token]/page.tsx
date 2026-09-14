import { MARKERS } from '@/lib/mock-data';
import { formatValue } from '@/lib/status';

// Screen 14: "Deliberately not the patient interface." No sidebar, no
// patient-facing chrome — a read-only clinical record, abnormals first.
export default function ClinicianViewPage({ params }: { params: { token: string } }) {
  const outsideInterval = MARKERS.filter((m) => m.status === 'out_of_range').sort((a, b) => {
    const foldA = a.value && a.referenceHigh ? a.value / a.referenceHigh : 0;
    const foldB = b.value && b.referenceHigh ? b.value / b.referenceHigh : 0;
    return foldB - foldA;
  });
  const borderline = MARKERS.filter((m) => m.status === 'needs_attention');

  return (
    <div className="min-h-screen bg-[#0B1B15] p-4 text-white sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card bg-[#12281F] p-4">
          <div>
            <p className="text-sm font-medium">Shared clinical record &middot; read only</p>
            <p className="text-xs text-white/50">Shared by the patient &middot; access expires 2 October 2026 &middot; every view is logged</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-pill bg-white/10 px-3 py-1.5 text-xs">Signed lab PDF</button>
            <button className="rounded-pill bg-white px-3 py-1.5 text-xs text-[#0B1B15]">Print</button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 rounded-card bg-[#12281F] p-4 text-xs sm:grid-cols-6">
          <Field label="Patient" value="Shayan" />
          <Field label="DOB · sex" value="1956-01-01 · M" />
          <Field label="Test ID" value="BAL-7845123" />
          <Field label="Collected" value="2026-02-09" />
          <Field label="Reported" value="2026-03-31" />
          <Field label="Specimen · method" value="Plasma, serum · IA" />
        </div>

        <div className="mb-6 rounded-card bg-[#12281F] p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-medium">Outside reference interval</p>
            <p className="text-xs text-white/50">{outsideInterval.length} of {MARKERS.length} &middot; sorted by fold-difference</p>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="text-white/40">
              <tr>
                <th className="px-4 py-2 font-normal">Analyte</th>
                <th className="px-4 py-2 font-normal">Result</th>
                <th className="px-4 py-2 font-normal">Interval</th>
                <th className="px-4 py-2 font-normal">Note</th>
                <th className="px-4 py-2 font-normal">Flag</th>
              </tr>
            </thead>
            <tbody>
              {outsideInterval.map((m) => (
                <tr key={m.id} className="border-t border-white/10">
                  <td className="px-4 py-2 font-medium">{m.name}</td>
                  <td className="px-4 py-2 text-status-elevated">{formatValue(m.value, m.unit)}</td>
                  <td className="px-4 py-2 text-white/60">{m.referenceText}</td>
                  <td className="px-4 py-2 text-white/60">{m.companionNote ?? m.interpretation ?? ''}</td>
                  <td className="px-4 py-2">
                    <span className="rounded-pill bg-status-elevated/20 px-2 py-0.5 text-status-elevated">H</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-card bg-[#12281F] p-4">
            <p className="mb-3 text-sm font-medium">Borderline</p>
            <div className="flex flex-col gap-2 text-xs">
              {borderline.map((m) => (
                <div key={m.id} className="flex items-center justify-between border-t border-white/10 pt-2 first:border-0 first:pt-0">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-status-watch">{formatValue(m.value, m.unit)}</p>
                  <p className="text-white/50">{m.referenceText}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card bg-[#12281F] p-4">
            <p className="mb-3 text-sm font-medium">Patient-reported context</p>
            <div className="flex flex-col gap-2 text-xs text-white/70">
              <p><span className="text-white/40">Medications</span> Atorvastatin 20 mg &middot; lisinopril 10 mg daily</p>
              <p><span className="text-white/40">Supplements</span> Vitamin D3 1,000 IU &middot; omega-3 &middot; magnesium</p>
              <p><span className="text-white/40">Fasting at draw</span> No &middot; last meal &asymp; 3h prior</p>
              <p><span className="text-white/40">Recent illness or injury</span> None reported in prior 14 days</p>
              <p><span className="text-white/40">Draw time</span> 08:20 local</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/30">
          Reference intervals as issued 31 March 2026. Results should be interpreted together with the patient&apos;s
          history, symptoms, medications and other laboratory findings. BioAro Inc. Precision Health Laboratory &middot; CLIA-registered.
        </p>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-white/40">{label.toUpperCase()}</p>
      <p className="mt-0.5 font-medium text-white">{value}</p>
    </div>
  );
}
