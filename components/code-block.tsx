'use client';

import { useCallback, useState } from 'react';
import { CodeIcon, LoaderIcon, PlayIcon, PythonIcon } from './icons';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [output, setOutput] = useState<string | null>(null);
  const [pyodide, setPyodide] = useState<any>(null);
  const match = /language-(\w+)/.exec(className || '');
  const isPython = match && match[1] === 'python';
  const codeContent = String(children).replace(/\n$/, '');
  const [tab, setTab] = useState<'code' | 'run'>('code');

  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        {tab === 'code' && (
          <pre
            {...props}
            className={`text-sm w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 font-mono`}
          >
            <code className="whitespace-pre-wrap break-words">{children}</code>
          </pre>
        )}

        {tab === 'run' && output && (
          <div className="text-sm w-full overflow-x-auto bg-gray-800 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-xl text-gray-200 dark:text-gray-100">
            <code>{output}</code>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-gray-100 dark:bg-gray-800 py-0.5 px-1.5 rounded-md font-mono`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
