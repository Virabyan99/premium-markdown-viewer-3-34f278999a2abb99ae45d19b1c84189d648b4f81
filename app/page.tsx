'use client';

import { useState, useEffect } from 'react';
import FileDrop from '@/components/FileDrop';
import LexicalViewer from '@/components/LexicalViewer';
import { parseMarkdownToAst } from '@/lib/parseMarkdownAst';
import { mdastToLexicalJson } from '@/lib/mdastToLexical';
import { Card, CardContent } from '@/components/ui/card';
import { FileSidebar } from '@/components/FileSidebar';
import { useFileStore } from '@/lib/fileStore';

export default function HomePage() {
  // State for Lexical JSON, loading, and error handling
  const [lexicalJson, setLexicalJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Access Zustand store for file management
  const files = useFileStore((s) => s.files);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const loadFiles = useFileStore((s) => s.loadFiles);
  const addFile = useFileStore((s) => s.addFile);

  // Load persisted files from IndexedDB on component mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Process the active file's Markdown to Lexical JSON when activeFileId or files change
  useEffect(() => {
    if (!activeFileId) {
      setLexicalJson(null);
      return;
    }
    const activeFile = files.find((f) => f.id === activeFileId);
    if (!activeFile) return;

    setLoading(true);
    setError(null);
    setLexicalJson(null);
    (async () => {
      try {
        const ast = parseMarkdownToAst(activeFile.content);
        const json = await mdastToLexicalJson(ast);
        setLexicalJson(json);
        setLoading(false);
      } catch (err) {
        console.error('Error processing Markdown:', err);
        setError('Failed to process Markdown');
        setLoading(false);
      }
    })();
  }, [activeFileId, files]);

  // Handle file upload by creating a new MarkdownFile and adding it to the store
  const handleFileRead = async (content: string, fileName: string) => {
    const newFile = {
      id: crypto.randomUUID(), // Generate a unique ID
      name: fileName,
      content,
      createdAt: Date.now(),
    };
    await addFile(newFile); // Add to store, which persists it and sets it as active
  };

  return (
    <div className="flex justify-center  h-screen">
      {/* Sidebar for file navigation */}
      <FileSidebar />
      {/* Main content area */}
      <main className="p-4 overflow-y-auto w-full max-w-4xl rounded-lg">
        {/* Show FileDrop when no file is selected */}
        {!activeFileId && <FileDrop onFileRead={handleFileRead} />}
        {/* Loading state */}
        {loading && (
          <Card>
            <CardContent className="pt-6 text-gray-500">Loading...</CardContent>
          </Card>
        )}
        {/* Error state */}
        {error && (
          <Card className="border-red-300">
            <CardContent className="pt-6 text-red-500">{error}</CardContent>
          </Card>
        )}
        {/* Display LexicalViewer when content is ready */}
        {lexicalJson && !loading && !error && <LexicalViewer json={lexicalJson} />}
      </main>
    </div>
  );
}