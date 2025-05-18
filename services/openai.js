import axios from 'axios';
const API_KEY = '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';

export const traducirAlChileno = async (frase, modo = 'normal') => {
  try {
    
    let estilo = '';

    switch (modo) {
      case 'normal':
        estilo = 'con modismos chilenos cotidianos, informal, relajado y divertido';
        break;
      case 'grosero':
        estilo = 'como un chileno flaite diciendo muchas groserías y garabatos, que sea divertido';
        break;
      case 'flaite':
        estilo = 'en modo flaite extremo, usando jerga callejera chilena';
        break;
      case 'cuico zorrón':
        estilo = 'como un cuico zorrón de clase alta chilena, usando modismos cuicos y exagerando su tono refinado';
        break;
      case 'huaso':
        estilo = 'como un huaso chileno del campo, con dichos rurales del sur';
        break;
      case 'poeta':
        estilo = 'como un poeta urbano chileno, con rimas y metáforas';
        break;
      case 'borracho':
        estilo = 'como un chileno muy borracho hablando arrastrado, desinhibido y medio incoherente';
        break;
      case 'abuelo':
        estilo = 'como un abuelito chileno, usando frases antiguas como mijo, dichos típicos y sabiduría popular';
        break;
      case 'infunable':
        estilo = 'como un chileno con tono irónico, sarcástico y políticamente incorrecto, como alguien que no tiene miedo a la funa';
        break;
      case 'metalero':
        estilo = 'con lenguaje oscuro, dramático, existencialista y con energía intensa, como un metalero chileno';
        break;
      case 'hincha':
        estilo = 'como un hincha apasionado del fútbol chileno, con emoción, garabatos y frases futboleras';
        break;
      case 'republicano':
        estilo = 'de forma muy formal, moralista, patriótica y conservadora, como un político de derecha chileno';
        break;
      case 'pokemon':
        estilo = 'como un adolescente de los años 2000 en Chile, con mezcla de ternura dark y jerga pokemona';
        break;
      case 'progre':
        estilo = 'con lenguaje inclusivo, progresista, reflexivo y cargado de conciencia social chilena actual, como si fuera ñuñoino';
        break;
      case 'lolo':
        estilo = 'como un tiktoker o lolo chileno actual, usando modismos juveniles, anglicismos y energía de redes';
        break;
      case 'mami':
        estilo = 'como una mamá chilena que es enojona con sus hijos';
        break;
      default:
        estilo = 'con modismos chilenos cotidianos, informal, relajado y divertido';
        break;
    }



    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        //model: 'gpt-3.5-turbo',
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Traduce esta frase ${estilo}: "${frase}"`,
          },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error al traducir:', error.response?.data || error.message);
    return 'Ups... no pude chilenizar eso ahora.';
  }
};
