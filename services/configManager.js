import { getDoc, doc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../firebase";

const CONFIG_KEY = "@app_config";

export const configManager = async () => {
  try {
    // Referencias
    const modeloRef = doc(db, "configuration", "openAI");
    const adsRef = doc(db, "configuration", "ads");

    const [modelSnap, adsSnap] = await Promise.all([
      getDoc(modeloRef),
      getDoc(adsRef)
    ]);

    // Datos
    const openAIData = modelSnap.exists() ? modelSnap.data() : {};
    const adsData = adsSnap.exists() ? adsSnap.data() : {};

    // Garantizamos defaults
    const modelConfig = {
      model: openAIData.model ?? 'gpt-3.5-turbo',
      temperature: typeof openAIData.temperature === 'number' ? openAIData.temperature : 0.8
    };

    // Garantizamos defaults
    const adsConfig = {
      numClicks: adsData.numClicks ?? 5
    };

    const configFinal = {
      openAI: modelConfig,
      ads: adsConfig
    };

    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(configFinal));
    return configFinal;
  } catch (error) {
    return null;
  }
};

export const obtenerConfiguracionLocal = async () => {
  try {
    const stored = await AsyncStorage.getItem(CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

// Soporta claves tipo "ads.numClicks"
export const obtenerValorConfig = async (clave, valorPorDefecto = null) => {
  const config = await obtenerConfiguracionLocal();
  if (!config) return valorPorDefecto;

  const keys = clave.split('.');
  let resultado = config;

  for (let k of keys) {
    if (resultado[k] === undefined) return valorPorDefecto;
    resultado = resultado[k];
  }

  return resultado;
};
