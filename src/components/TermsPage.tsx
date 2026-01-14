import { TermsOfUse } from './TermsOfUse';

export function TermsPage() {
  return (
    <div>
      <div className="bg-indigo-50 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Terms of Use</h1>
        </div>
      </div>
      <TermsOfUse />
    </div>
  );
}

