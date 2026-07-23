"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  chart: string;
}

export default function MermaidViewer({ chart }: MermaidViewerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
    
    if (ref.current) {
      // Remove any existing children to prevent duplication on re-render
      ref.current.innerHTML = '';
      
      const renderChart = async () => {
        try {
          const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid render error', error);
          if (ref.current) {
            ref.current.innerHTML = `<div class="text-red-500">Failed to render diagram</div>`;
          }
        }
      };
      
      renderChart();
    }
  }, [chart]);

  return <div ref={ref} className="overflow-x-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner" />;
}
