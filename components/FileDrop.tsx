'use client';

import { useRef } from 'react';

export default function FileDrop({
  onFileRead,
}: {
  onFileRead: (content: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

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
    reader.onload = () => onFileRead(reader.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="w-full min-h-[200px] flex justify-center items-center p-4">
      <img
        src="/transparent_icon.png"
        onClick={() => inputRef.current?.click()}
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