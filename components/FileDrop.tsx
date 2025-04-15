'use client';

import { useRef, useState } from 'react';

export default function FileDrop({
  onFileRead,
}: {
  onFileRead: (content: string, fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.md')) {
      alert('Please upload a .md file only.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onFileRead(reader.result as string, file.name);
    reader.readAsText(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div
      className={`w-full h-full flex justify-center items-center p-4 ${
        isDragging ? 'bg-gray-100' : ''
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <img
        src="/transparent_icon.png"
        className="w-32 h-32 cursor-pointer"
      />
      <input
        type="file"
        accept=".md"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}