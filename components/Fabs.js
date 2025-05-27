import { View, TouchableOpacity, StyleSheet, Share, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const Fabs = () => {

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
    <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={compartirApp}>
            <MaterialIcons name="share" size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fab, styles.fab2]} onPress={calificarApp}>
            <MaterialIcons name="star-rate" size={24} color="#ffffff" />
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    flexDirection: 'row',
    gap: 12,
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

});
