'use client';

import { useEffect } from 'react';
import { initClient, render } from './main.js';

export default function SiteClient() {
  useEffect(() => {
    render();
    initClient();

    return () => {
      window.onpopstate = null;
      window.onhashchange = null;
    };
  }, []);

  return null;
}
