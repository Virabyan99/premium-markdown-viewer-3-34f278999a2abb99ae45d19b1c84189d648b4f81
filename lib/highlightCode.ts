import * as shiki from 'shiki';

let highlighter: shiki.Highlighter | null = null;

export async function initializeHighlighter(): Promise<shiki.Highlighter> {
  if (!highlighter) {
    highlighter = await shiki.createHighlighter({
      themes: ['one-dark-pro'],
      langs: [
        'javascript',
        'typescript',
        'python',
        'java',
        'c',
        'cpp',
        'csharp',
        'go',
        'rust',
        'html',
        'css',
        'json',
        'yaml',
        'markdown',
        'bash',
        'sql',
        'php',
        'tsx',
        'jsx',
        "ruby",
        "swift",
      ],
    });
  }
  return highlighter!;
}

export async function highlightCode(code: string, lang: string = 'text'): Promise<string> {
  const hl = await initializeHighlighter();
  const supportedLangs = hl.getLoadedLanguages();
  const language = supportedLangs.includes(lang) ? lang : 'text';
  return hl.codeToHtml(code, { lang: language, theme: 'one-dark-pro' });
}