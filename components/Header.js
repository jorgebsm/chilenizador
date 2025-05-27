import { View, Text, Image, StyleSheet } from 'react-native';

export const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/original_png.png')}
        style={styles.logoHeader}
        resizeMode="contain"
      />
      <Text style={styles.headerText}>Chilenizador</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
