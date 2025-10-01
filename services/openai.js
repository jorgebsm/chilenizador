import axios from 'axios';

const BACKEND_URL = 'https://chilenizador-backend-production.up.railway.app/api/translate';

export const traducirAlChileno = async (frase, modo = 'normal') => {
  try {
    const res = await axios.post(
      BACKEND_URL,
      {
        frase,
        modo,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos de timeout
      }
    );

    // El backend retornará { traduccion, modo, modelo }
    return res.data.traduccion;
  } catch (error) {
    console.error('Error al traducir:', error.response?.data || error.message);

    if (error.code === 'ECONNABORTED') {
      return 'La traducción está tardando mucho. Intenta de nuevo.';
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return 'No se puede traducir en este momento. Intenta de nuevo.';
    }

    if (error.response?.status === 429) {
      return 'No se puede traducir en este momento. Intenta de nuevo.';
    }

    return error.response?.data?.error || 'Ups... no pude chilenizar eso ahora.';
  }
};
