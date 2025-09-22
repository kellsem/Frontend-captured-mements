import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { axiosInstance } from './api/axiosinstance.ts';


// Teste inicial de conexão
axiosInstance.get('/api/health')
  .then(response => {
    console.log('✅ Backend conectado:', response.data);
  })
  .catch(error => {
    console.error('Erro ao conectar com backend:', error);
  });

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <App />
  </StrictMode>,
)
