'use client';

import { useState, useEffect, useRef } from 'react';
import FileDrop from '@/components/FileDrop';
import LexicalViewer from '@/components/LexicalViewer';
import { parseMarkdownToAst } from '@/lib/parseMarkdownAst';
import { mdastToLexicalJson } from '@/lib/mdastToLexical';
import { Card, CardContent } from '@/components/ui/card';
import { FileSidebar } from '@/components/FileSidebar';
import { useFileStore } from '@/lib/fileStore';

export default function HomePage() {
  const [lexicalJson, setLexicalJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const files = useFileStore((s) => s.files);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const loadFiles = useFileStore((s) => s.loadFiles);
  const addFile = useFileStore((s) => s.addFile);

  const mainRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

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

  const handleFileRead = async (content: string, fileName: string) => {
    const newFile = {
      id: crypto.randomUUID(),
      name: fileName,
      content,
      createdAt: Date.now(),
    };
    await addFile(newFile);
  };

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current++;
      if (dragCounterRef.current === 1) {
        setIsDraggingOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsDraggingOver(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      dragCounterRef.current = 0;
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = () => {
          handleFileRead(reader.result as string, file.name);
        };
        reader.readAsText(file);
      } else {
        alert('Please drop a .md file only.');
      }
    };

    mainElement.addEventListener('dragenter', handleDragEnter);
    mainElement.addEventListener('dragleave', handleDragLeave);
    mainElement.addEventListener('dragover', handleDragOver);
    mainElement.addEventListener('drop', handleDrop);

    return () => {
      mainElement.removeEventListener('dragenter', handleDragEnter);
      mainElement.removeEventListener('dragleave', handleDragLeave);
      mainElement.removeEventListener('dragover', handleDragOver);
      mainElement.removeEventListener('drop', handleDrop);
    };
  }, [handleFileRead]);

  return (
    <div className="flex h-screen">
      <FileSidebar />
      <main
        ref={mainRef}
        className={`flex-1 p-4 overflow-y-auto ${isDraggingOver ? 'bg-gray-100' : ''}`}
      >
        {!activeFileId && <FileDrop onFileRead={handleFileRead} />}
        {loading && (
          <Card>
            <CardContent className="pt-6 text-gray-500">Loading...</CardContent>
          </Card>
        )}
        {error && (
          <Card className="border-red-300">
            <CardContent className="pt-6 text-red-500">{error}</CardContent>
          </Card>
        )}
        {lexicalJson && !loading && !error && <LexicalViewer json={lexicalJson} />}
      </main>
    </div>
  );
}