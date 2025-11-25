import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from './ChatWidget';

window.BurkanChatWidget = {
  mountChatWidget: (elementId, options = {}) => {
    const apiUrl = options.apiUrl || "https://backend-0ftm.onrender.com";
    const container = document.getElementById(elementId);
    if (container) {
      createRoot(container).render(
        <ChatWidget apiUrl={apiUrl} />
      );
    }
  }
};
