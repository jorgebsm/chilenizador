import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { obtenerValorConfig } from '../services/configManager';

const CLICKS_KEY = "@ads_clicks";
const adUnitId = 'ca-app-pub-8096470331985565/2771382383'; // producción //TestIds.INTERSTITIAL //test

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useAnuncios = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [numClicksParaAnuncio, setNumClicksParaAnuncio] = useState(5);

  useEffect(() => {
    const init = async () => {
      const storedClicks = await AsyncStorage.getItem(CLICKS_KEY);
      if (storedClicks !== null) setClicks(parseInt(storedClicks));

      const clicksConfig = await obtenerValorConfig("ads.numClicks", 5);
      setNumClicksParaAnuncio(parseInt(clicksConfig) || 5);
    };
    init();

    const loadListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsAdLoaded(true);
    });

    const closeListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      interstitial.load(); // vuelve a cargar
      setIsAdLoaded(false);
    });

    interstitial.load();

    return () => {
      loadListener();
      closeListener();
    };
  }, []);

  const manejarClickYMostrarAnuncio = async () => {
    const nuevoContador = clicks + 1;

    if (nuevoContador >= numClicksParaAnuncio) {
      if (isAdLoaded) {
        interstitial.show();
      }
      await AsyncStorage.setItem(CLICKS_KEY, '0');
      setClicks(0);
    } else {
      await AsyncStorage.setItem(CLICKS_KEY, nuevoContador.toString());
      setClicks(nuevoContador);
    }
  };

  return { manejarClickYMostrarAnuncio };
};
