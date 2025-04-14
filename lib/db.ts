import Dexie, { Table } from 'dexie';

export interface MarkdownFile {
  id: string;
  name: string;
  content: string;
  createdAt: number;
}

class MarkdownDB extends Dexie {
  files!: Table<MarkdownFile>;

  constructor() {
    super('MarkdownDB');
    this.version(1).stores({
      files: 'id, name, createdAt',
    });
  }
}

export const db = new MarkdownDB();