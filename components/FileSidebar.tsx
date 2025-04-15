'use client'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, ChevronLeft, X } from 'lucide-react'
import { useFileStore } from '@/lib/fileStore'
import { useEffect } from 'react'
import Image from 'next/image'

const IconFileArrowRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-file-arrow-right">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    <path d="M9 15h6" />
    <path d="M12.5 17.5l2.5 -2.5l-2.5 -2.5" />
  </svg>
)

export function FileSidebar() {
  // Access Zustand store
  const files = useFileStore((s) => s.files)
  const activeFileId = useFileStore((s) => s.activeFileId)
  const setActiveFile = useFileStore((s) => s.setActiveFile)
  const loadFiles = useFileStore((s) => s.loadFiles)
  const deleteFile = useFileStore((s) => s.deleteFile)

  // Load files on mount
  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-6 transform -translate-y-1/2 z-50">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="m-2">Recent Files</SheetTitle>
        <ScrollArea className="h-[calc(100%-2rem)]">
          {files.length === 0 ? (
            <p className="text-gray-500 p-2">No files uploaded yet.</p>
          ) : (
            <div className="space-y-2 p-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-2">
                  <Button
                    variant={file.id === activeFileId ? 'default' : 'ghost'}
                    className="flex-1 min-w-0 max-w-48"
                    onClick={() => setActiveFile(file.id)}>
                    <span
                      className="truncate-middle px-1 text-sm font-medium"
                      title={file.name}>
                      {file.name}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteFile(file.id)}
                    className="mr-3">
                      
                    {IconFileArrowRight}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
