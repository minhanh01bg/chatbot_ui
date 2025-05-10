import Documents from '@/components/admin/documents/Documents';
import ChatTest from '@/components/admin/ChatTest';

export default function DocumentsPage() {
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4">Documents</h1> */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Documents />
        </div>
        
        <div className="h-[calc(100vh-14rem)]">
          <div className="border rounded-lg bg-background shadow overflow-hidden">
            <div className="px-4 pt-4 pb-4 border-b">
              <h2 className="text-xl font-semibold mb-2">Test Imported Data</h2>
              <p className="text-sm text-muted-foreground">
                Use this chat interface to test how your imported documents respond to queries.
              </p>
            </div>
            <div className="px-4 py-4 h-[calc(100vh-24rem)]">
              <ChatTest variant="embedded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 