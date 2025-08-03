import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ParentalControlProvider } from './contexts/ParentalControlContext';
import { ProfilesProvider } from './contexts/ProfilesContext';
import { FilterProvider } from './contexts/FilterContext'; // <-- Importa o novo provider
import App from './App.jsx';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ProfilesProvider>
          <AuthProvider>
            <FavoritesProvider>
              <ParentalControlProvider>
                <FilterProvider> {/* <-- Envolve com o FilterProvider */}
                  <App />
                </FilterProvider>
              </ParentalControlProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ProfilesProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);