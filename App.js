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
import { configManager, obtenerValorConfig } from './services/configManager';
import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const interstitial = InterstitialAd.createForAdRequest(
  //TestIds.INTERSTITIAL, // Reemplazar por tu ID real en producción
  'ca-app-pub-8096470331985565/2771382383',
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

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

export default function App() {
  const [textoOriginal, setTextoOriginal] = useState('');
  const [traduccion, setTraduccion] = useState('');
  const [modo, setModo] = useState('normal');
  const [cargando, setCargando] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [numClicksParaAnuncio, setNumClicksParaAnuncio] = useState(5);
  const CLICKS_KEY = "@ads_clicks";

  const [fontsLoaded] = useFonts({
    PoppinsRegular: Poppins_400Regular,
    PoppinsBold: Poppins_700Bold,
  });

  useEffect(() => {
    const inicializarApp = async () => {
      try {
        await configManager();
        const storedClicks = await AsyncStorage.getItem(CLICKS_KEY);
        if (storedClicks !== null) {
          // console.log("storedClicks "+ storedClicks);
          
          setClicks(parseInt(storedClicks));
        }

        const storedClicksToAd = await obtenerValorConfig("ads.numClicks", 5);
        setNumClicksParaAnuncio(parseInt(storedClicksToAd) || 5);

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
    const nuevoContador = clicks + 1;

    // console.log("nuevoContador " +nuevoContador );
    // console.log("numClicksParaAnuncio "+ numClicksParaAnuncio);
    // console.log("isAdLoaded "+ isAdLoaded);
    

    if (nuevoContador >= numClicksParaAnuncio) {
      if (isAdLoaded) {
        // console.log("✅ Anuncio mostrado");
        interstitial.show();
        setClicks(0);
        await AsyncStorage.setItem(CLICKS_KEY, '0');
        setIsAdLoaded(false);
      } else {
        // console.log("⚠️ Anuncio no cargado, se reinicia contador igual");
        setClicks(0);
        await AsyncStorage.setItem(CLICKS_KEY, '0');
      }
    } else {
      // console.log("⏳ No aplica anuncio aún");
      setClicks(nuevoContador);
      await AsyncStorage.setItem(CLICKS_KEY, nuevoContador.toString());
    }


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

  const compartirApp = async () => {
    await Share.share({
      message: '¡Descarga Chilenizador y habla de pana! 🇨🇱\nhttps://play.google.com/store/apps/details?id=com.douapps.chilenizador',
    });
  };

  const calificarApp = async () => {
    const url = Platform.OS === 'android'
      ? 'market://details?id=com.douapps.chilenizador'
      : 'https://play.google.com/store/apps/details?id=com.douapps.chilenizador';

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn('No se puede abrir el enlace de calificación');
      }
    } catch (error) {
      console.error('Error al abrir enlace de calificación:', error);
    }
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
                contentContainerStyle={styles.selectorModosContainer}
              >
                <View style={styles.selectorModos}>
                  {/* Fila 1 */}
                  <View style={styles.filaModos}>
                    {modos.slice(0, Math.ceil(modos.length / 2)).map((item) => (
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
                  </View>

                  {/* Fila 2 */}
                  <View style={styles.filaModos}>
                    {modos.slice(Math.ceil(modos.length / 2)).map((item) => (
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
                  </View>
                </View>
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

        {/* <TouchableOpacity style={styles.fab} onPress={compartirApp}>
          <MaterialIcons name="share" size={28} color="#ffffff" />
        </TouchableOpacity> */}

        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={compartirApp}>
            <MaterialIcons name="share" size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.fab, styles.fab2]} onPress={calificarApp}>
            <MaterialIcons name="star-rate" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>


        

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
  fab2: {
    right: 85,
  },
  // selectorModos: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   rowGap: 8, // espacio entre filas
  //   columnGap: 10, // espacio entre columnas (puedes usar `gap` si tu versión de RN lo soporta)
  //   maxHeight: 88, // altura estimada para 2 filas (ajusta según el tamaño de tus botones)
  //   marginBottom: 16,
  //   paddingRight: 10,
  // },
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
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'PoppinsBold',
  },
  selectorModosContainer: {
    paddingRight: 20,   
    marginBottom: 16
  },
  selectorModos: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },
  filaModos: {
    flexDirection: 'row',
    gap: 10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    flexDirection: 'row',
    gap: 12,
  },

 


});
