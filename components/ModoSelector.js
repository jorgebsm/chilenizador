import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export const ModoSelector = ({ modos, modoSeleccionado, setModoSeleccionado }) => {
  const mitad = Math.ceil(modos.length / 2);
  const primeraFila = modos.slice(0, mitad);
  const segundaFila = modos.slice(mitad);

  return (
    <>
      <Text style={styles.label}>Escoge un modo</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorModosContainer}
      >
        <View style={styles.selectorModos}>
          <View style={styles.filaModos}>
            {primeraFila.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setModoSeleccionado(item.key)}
                style={[
                  styles.botonModo,
                  modoSeleccionado === item.key && styles.botonModoActivo,
                ]}
              >
                <Text
                  style={[
                    styles.textoModo,
                    modoSeleccionado === item.key && styles.textoModoActivo,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filaModos}>
            {segundaFila.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setModoSeleccionado(item.key)}
                style={[
                  styles.botonModo,
                  modoSeleccionado === item.key && styles.botonModoActivo,
                ]}
              >
                <Text
                  style={[
                    styles.textoModo,
                    modoSeleccionado === item.key && styles.textoModoActivo,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    marginBottom: 8,
    color: '#1E293B',
  },
  selectorModosContainer: {
    paddingRight: 20,
    marginBottom: 16,
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
});
