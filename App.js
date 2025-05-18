import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { traducirAlChileno } from './services/openai';
import { Keyboard } from 'react-native';
import { Share } from 'react-native';
import { ActivityIndicator } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds
} from 'react-native-google-mobile-ads';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const interstitial = InterstitialAd.createForAdRequest(
  //TestIds.INTERSTITIAL, // Reemplazar por tu ID real en producción
  'ca-app-pub-8096470331985565/2771382383',
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [textoOriginal, setTextoOriginal] = useState('');
  const [traduccion, setTraduccion] = useState('');
  const [modo, setModo] = useState('normal');
  const [cargando, setCargando] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: Poppins_400Regular,
    PoppinsBold: Poppins_700Bold,
  });

  useEffect(() => {
  const loadListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    setIsAdLoaded(true);
  });

  const closeListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    interstitial.load();
    setIsAdLoaded(false);
  });

  interstitial.load();

  return () => {
    loadListener();
    closeListener();
  };
}, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const manejarTraduccion = async () => {

    if (clicks + 1 >= 1000 && isAdLoaded) {
      interstitial.show();
      setClicks(0);
      setIsAdLoaded(false); // para evitar mostrarlo otra vez sin cargar
    } else {
      setClicks(clicks + 1);
    }

    if (!textoOriginal.trim()) return;
    Keyboard.dismiss();

    // Procesar traducción normalmente
    try {
      const rawResultado = await traducirAlChileno(textoOriginal, modo);
      if (!rawResultado || typeof rawResultado !== 'string') {
        setTraduccion('Ups... no se pudo traducir');
        return;
      }

      let resultado = rawResultado.trim();

      // Solo remover si TODO el texto comienza y termina con comillas Y no hay otras comillas adentro
      const quitarComillasSiCorresponde = (texto) => {
        const esComillaNormal = texto.startsWith('"') && texto.endsWith('"');
        const esComillaTipografica = texto.startsWith('“') && texto.endsWith('”');
        const tieneMasComillasInternas =
          texto.slice(1, -1).includes('"') || texto.slice(1, -1).includes('“') || texto.slice(1, -1).includes('”');

        if ((esComillaNormal || esComillaTipografica) && !tieneMasComillasInternas) {
          return texto.slice(1, -1).trim();
        }
        return texto;
      };

      resultado = quitarComillasSiCorresponde(resultado);

      setTraduccion(resultado);
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

  const compartirApp = async () => {
    await Share.share({
      message: '¡Descarga Chilenizador y habla de pana! 🇨🇱\nhttps://play.google.com/store/apps/details?id=com.douapps.chilenizador',
    });
  };

  

  return (
    <>
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} onLayout={onLayoutRootView}>
        <StatusBar backgroundColor='#0b1e52'/>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('./assets/original_png.png')} // usa tu imagen aquí
              style={styles.logoHeader}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Chilenizador</Text>
          </View>

          <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 100 }]} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Escoge un modo</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectorModos}
            >
              {[
                { key: 'normal', label: 'Normal 👍' },
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
                { key: 'infunable', label: 'Infunable 🧨' },
                { key: 'poeta', label: 'Poeta 🎤' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setModo(item.key)}
                  style={[
                    styles.botonModo,
                    modo === item.key && styles.botonModoActivo,
                  ]}
                >
                  <Text
                    style={[
                      styles.textoModo,
                      modo === item.key && styles.textoModoActivo,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>


            <View style={styles.card}>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Escribe normal aquí..."
                value={textoOriginal}
                onChangeText={setTextoOriginal}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                maxLength={500}
              />
              {(textoOriginal.length > 0) && (
                <View style={styles.iconosInput}>
                  <TouchableOpacity onPress={borrarTexto} style={styles.icono}>
                    <Feather name="x" size={18} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => copiarTexto(textoOriginal)} style={styles.icono}>
                    <Feather name="copy" size={18} color="#1F2937" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.boton} onPress={manejarTraduccion}>
              <Text style={styles.botonTexto}>Chilenizar</Text>
            </TouchableOpacity>

            <Text style={styles.label}>En chileno sería</Text>
            <View style={[styles.card, styles.cardResultado]}>
              {cargando ? (
                  <View style={styles.placeholderContainer}>
                    <ActivityIndicator size="large" color="#0b1e52" />
                  </View>
                ) : traduccion ? (
                  <Text style={styles.resultadoTexto}>{traduccion}</Text>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Image
                      source={require('./assets/mapa.png')}
                      style={styles.placeholderImage}
                      resizeMode="contain"
                    />
                  </View>
                )}


              {traduccion !== '' && (
                <TouchableOpacity
                  onPress={() => copiarTexto(traduccion)}
                  style={styles.iconoResultado}
                >
                  <Feather name="copy" size={18} color="#1F2937" />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.fab} onPress={compartirApp}>
          <MaterialIcons name="share" size={28} color="#ffffff" />
        </TouchableOpacity>

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
  header: {
    backgroundColor: '#0b1e52',
    height: 70,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'PoppinsBold',
    top: 1,
    marginLeft: 64, 
  },
   logoHeader: {
    width: 60,
    height: 60,
    position: 'absolute',
    left: 14,
    top: '60%',
    transform: [{ translateY: -40 }],
  },
  body: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    marginBottom: 8,
    color: '#1E293B',
  },
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardResultado: {
    minHeight: 120,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
    color: '#111827',
    minHeight: 100,
  },
  boton: {
    backgroundColor: '#0b1e52',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  botonTexto: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    color: '#FFFFFF',
  },
  resultadoTexto: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
    color: '#1E293B',
  },
  iconosInput: {
  position: 'absolute',
  bottom: 8,
  right: 10,
  flexDirection: 'row',
  gap: 10,
  },
  iconoResultado: {
    position: 'absolute',
    bottom: 8,
    right: 10,
  },
  icono: {
    padding: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
  },
  iconoTexto: {
    fontSize: 16,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  placeholderImage: {
    width: 90,
    height: 90,
    marginBottom: 8,
    opacity: 0.4,
  },
  placeholderTexto: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'PoppinsRegular',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#0b1e52',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectorModos: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    paddingRight: 10,
  },
  botonModo: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
  },
  botonModoActivo: {
    backgroundColor: '#0b1e52',
  },
  textoModo: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: '#1F2937',
  },
  textoModoActivo: {
    color: '#FFFFFF',
    fontFamily: 'PoppinsBold',
  },
 


});
