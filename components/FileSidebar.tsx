'use client';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, X } from 'lucide-react';
import { useFileStore } from '@/lib/fileStore';
import { useEffect } from 'react';

export function FileSidebar() {
  // Access Zustand store
  const files = useFileStore((s) => s.files);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const loadFiles = useFileStore((s) => s.loadFiles);
  // Assuming deleteFile is implemented in the store; add if missing
  const deleteFile = useFileStore((s) => s.deleteFile);

  // Load files on mount, as in the example
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-6 transform -translate-y-1/2 z-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="m-2">Uploaded Files</SheetTitle>
        <ScrollArea className="h-[calc(100%-2rem)]">
          {files.length === 0 ? (
            <p className="text-gray-500 p-2">No files uploaded yet.</p>
          ) : (
            <div className="space-y-2 p-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between">
                  <Button
                    variant={file.id === activeFileId ? 'default' : 'ghost'}
                    className="flex-1 justify-start overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]"
                    onClick={() => setActiveFile(file.id)}
                  >
                    {file.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}