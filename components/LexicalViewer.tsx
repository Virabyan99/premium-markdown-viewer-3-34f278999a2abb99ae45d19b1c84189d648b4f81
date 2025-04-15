'use client';

import { useState, useRef, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { Card, CardContent } from '@/components/ui/card';
import { HighlightedCodeNode } from './HighlightedCodeNode';
import { TextNode } from 'lexical';

const theme = {
  paragraph: 'mb-4 text-sm md:text-base',
  heading: {
    h1: 'text-2xl font-bold mb-4 md:text-3xl',
    h2: 'text-xl font-semibold mb-3 md:text-2xl',
  },
  text: { bold: 'font-bold', italic: 'italic' },
  code: 'bg-gray-800 text-white p-2 rounded block font-mono text-xs md:text-sm',
  list: { ul: 'list-disc pl-4 md:pl-6', ol: 'list-decimal pl-4 md:pl-6' },
};

const langFontMap = {
  kr: 'font-kr',
  jp: 'font-jp',
  sc: 'font-sc',
  default: '',
};

function Page({ pageJson }: { pageJson: string }) {
  const [editor] = useLexicalComposerContext();
  const isMounted = useRef(false);

  if (!isMounted.current) {
    try {
      const state = editor.parseEditorState(pageJson);
      editor.setEditorState(state);
      isMounted.current = true;
    } catch (error) {
      console.error('Error setting page state:', error);
    }
  }

  editor.update(() => {
    const root = editor.getRootElement();
    if (root) {
      const nodes = JSON.parse(pageJson).root.children;
      nodes.forEach((node: any, index: number) => {
        const element = root.children[index] as HTMLElement;
        if (element && (node.type === 'paragraph' || node.type === 'heading')) {
          const fontClass = langFontMap[node.lang || 'default'];
          element.className = `prose ${fontClass} ${theme[node.type] || ''}`;
        }
      });
    }
  });

  return (
    <>
      <RichTextPlugin
        contentEditable={<ContentEditable className="prose max-w-none p-1 md:p-2" />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin />
    </>
  );
}

export default function LexicalViewer({ json }: { json: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  let parsedState;
  try {
    parsedState = JSON.parse(json);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return (
      <Card>
        <CardContent>Error loading content</CardContent>
      </Card>
    );
  }

  const nodesPerPage = 5;
  const totalNodes = parsedState.root.children.length;
  const pageCount = Math.ceil(totalNodes / nodesPerPage);

  const getVisiblePages = (current: number) => {
    const pagesBefore = 2;
    const pagesAfter = 2;
    let start = Math.max(0, current - pagesBefore);
    let end = Math.min(pageCount, current + pagesAfter + 1);

    const visibleCount = end - start;
    if (visibleCount < 5) {
      if (start === 0) {
        end = Math.min(5, pageCount);
      } else if (end === pageCount) {
        start = Math.max(0, pageCount - 5);
      }
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  const initialVisiblePages = Array.from(
    { length: Math.min(3, pageCount) },
    (_, i) => i
  );
  const [visiblePages, setVisiblePages] = useState<number[]>(initialVisiblePages);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageIndex = parseInt(
              entry.target.getAttribute('data-page') || '0',
              10
            );
            setCurrentPage(pageIndex);
            setVisiblePages(getVisiblePages(pageIndex));
          }
        });
      },
      { root: containerRef.current, threshold: 0.5 }
    );
    observerRef.current = observer;

    pageRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [pageCount, visiblePages]);

  return (
    <div className='w-full'>

    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-2 ">
        <div
          ref={containerRef}
          className="max-h-[86vh] overflow-y-auto space-y-4"
        >
          {visiblePages.map((idx) => {
            const start = idx * nodesPerPage;
            const end = start + nodesPerPage;
            const pageNodes = parsedState.root.children.slice(start, end);
            const pageJson = JSON.stringify({
              root: { ...parsedState.root, children: pageNodes },
            });
            return (
              <div
                key={idx}
                ref={(el) => (pageRefs.current[idx] = el)}
                data-page={idx}
                className="transition-opacity duration-300"
              >
                <LexicalComposer
                  initialConfig={{
                    namespace: `Page${idx}`,
                    theme,
                    nodes: [
                      HeadingNode,
                      TextNode,
                      ListNode,
                      ListItemNode,
                      HighlightedCodeNode,
                    ],
                    editable: false,
                    onError: console.error,
                  }}
                >
                  <Page pageJson={pageJson} />
                </LexicalComposer>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
    </div>

  );
}