import Sites from '@/components/admin/sites/Sites';

export default function SitesPage() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Sites />
        </div>
      </div>
    </div>
  );
} 