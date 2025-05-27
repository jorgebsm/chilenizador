import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export const TraductorSection = ({
  textoOriginal,
  setTextoOriginal,
  traduccion,
  cargando,
  onChilenizarPress,
  copiarTexto,
  borrarTexto
}) => {
  const quitarComillasSiCorresponde = (texto) => {
    const esComillaNormal = texto.startsWith('"') && texto.endsWith('"');
    const esComillaTipografica = texto.startsWith('“') && texto.endsWith('”');
    const tieneInternas = texto.slice(1, -1).includes('"') || texto.slice(1, -1).includes('“') || texto.slice(1, -1).includes('”');
    return (esComillaNormal || esComillaTipografica) && !tieneInternas ? texto.slice(1, -1).trim() : texto;
  };

  return (
    <>
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
        {textoOriginal.length > 0 && (
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

      <TouchableOpacity style={styles.boton} onPress={onChilenizarPress}>
        <Text style={styles.botonTexto}>Chilenizar</Text>
      </TouchableOpacity>

      <Text style={styles.label}>En chileno sería</Text>
      <View style={[styles.card, styles.cardResultado]}>
        {cargando ? (
          <View style={styles.placeholderContainer}>
            <ActivityIndicator size="large" color="#0b1e52" />
          </View>
        ) : traduccion ? (
          <Text style={styles.resultadoTexto}>
            {quitarComillasSiCorresponde(traduccion)}
          </Text>
        ) : (
          <View style={styles.placeholderContainer}>
            <Image
              source={require('../assets/mapa.png')}
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
    </>
  );
};

const styles = StyleSheet.create({
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
  label: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    marginBottom: 8,
    color: '#1E293B',
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
});
