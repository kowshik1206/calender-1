import React from 'react';
import ReactDOM from 'react-dom/client';
import CalendarView from './components/Calendar/CalendarView';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <CalendarView />
      </div>
    </div>
  </React.StrictMode>,
);
