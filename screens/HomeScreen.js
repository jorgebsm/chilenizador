import { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { traducirAlChileno } from '../services/openai';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { configManager } from '../services/configManager';
import { Fabs } from '../components/Fabs'
import { Header } from '../components/Header';
import { ModoSelector } from '../components/ModoSelector';
import { TraductorSection } from '../components/TraductorSection';
import { useAnuncios } from '../hooks/useAnuncios';
// import { AdBanner } from '../components/AdBanner'

const modos = [
  { key: 'normal', label: 'Normal 🇨🇱' },
  { key: 'grosero', label: 'Grosero 🤬' },
  { key: 'flaite', label: 'Flaite 🧢' },
  { key: 'cuico zorrón', label: 'Cuico 💅' },
  { key: 'huaso', label: 'Huaso 🤠' },
  { key: 'borracho', label: 'Borracho 🍻' },
  { key: 'abuelo', label: 'Abuelo 👴' },
  { key: 'mami', label: 'Mami 🤱' },
  { key: 'metalero', label: 'Metalero 🤘' },
  { key: 'hincha', label: 'Hincha ⚽' },
  { key: 'republicano', label: 'Republicano 🧔🏻' },
  { key: 'progre', label: 'Progre 🟪' },
  { key: 'pokemon', label: 'Pokemón 🎧' },
  { key: 'lolo', label: 'Lolo 🧢' },
  { key: 'infunable', label: 'Infunable 🤫' },
  { key: 'poeta', label: 'Poeta ✍️' },
  { key: 'gamer', label: 'Gamer 🎮' },
  { key: 'otaku', label: 'Otaku 🍥' }
];

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [textoOriginal, setTextoOriginal] = useState('');
  const [traduccion, setTraduccion] = useState('');
  const [modo, setModo] = useState('normal');
  const [cargando, setCargando] = useState(false);
  const { manejarClickYMostrarAnuncio } = useAnuncios();

  const [fontsLoaded] = useFonts({
    PoppinsRegular: Poppins_400Regular,
    PoppinsBold: Poppins_700Bold,
  });

  useEffect(() => {
  const inicializarApp = async () => {
    try {
      await configManager();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    } catch (error) {
      console.error("Error al inicializar app:", error);
      await SplashScreen.hideAsync();
    }
  };

  inicializarApp();
}, [fontsLoaded]);
 
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const manejarTraduccion = async () => {
    await manejarClickYMostrarAnuncio();

    if (!textoOriginal.trim()) return;
    Keyboard.dismiss();
    setCargando(true);

    try {
      const rawResultado = await traducirAlChileno(textoOriginal, modo);
      let resultado = typeof rawResultado === 'string' ? rawResultado.trim() : 'Ups... no se pudo traducir';

      const quitarComillasSiCorresponde = (texto) => {
        const esComillaNormal = texto.startsWith('"') && texto.endsWith('"');
        const esComillaTipografica = texto.startsWith('“') && texto.endsWith('”');
        const tieneInternas = texto.slice(1, -1).includes('"') || texto.slice(1, -1).includes('“') || texto.slice(1, -1).includes('”');
        return (esComillaNormal || esComillaTipografica) && !tieneInternas ? texto.slice(1, -1).trim() : texto;
      };

      setTraduccion(quitarComillasSiCorresponde(resultado));
    } catch (err) {
      setTraduccion('Hubo un error al traducir');
    } finally {
      setCargando(false);
    }
  };

  const copiarTexto = async (texto) => {
    await Clipboard.setStringAsync(texto);
  };

  const borrarTexto = () => {
    setTextoOriginal('');
    setTraduccion('');
  }

  return (
    <>
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} onLayout={onLayoutRootView}>
        <StatusBar style="light" backgroundColor='#fff'/>
        <View style={styles.container}>
          <Header />

          <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 100 }]} keyboardShouldPersistTaps="handled">
            <ModoSelector modos={modos} modoSeleccionado={modo} setModoSeleccionado={setModo} />
            <TraductorSection
                textoOriginal={textoOriginal}
                setTextoOriginal={setTextoOriginal}
                traduccion={traduccion}
                cargando={cargando}
                onChilenizarPress={manejarTraduccion}
                copiarTexto={copiarTexto}
                borrarTexto={borrarTexto}
            />
          </ScrollView>
        </View>
        <Fabs />
        {/* <AdBanner /> */}
      </SafeAreaView>
    </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0b1e52',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    padding: 20,
  }

});
