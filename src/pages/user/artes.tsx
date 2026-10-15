import { useRouter } from '@/lib/navigation';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native-web';

export default function ArtesScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Portfólio</Text>
        <Text style={styles.title}>Artes</Text>
        <Text style={styles.description}>
          Este espaço ainda não possui trabalhos cadastrados para exibição.
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/novo-agendamento')}>
          <Text style={styles.buttonText}>Agendar horário</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#09090B',
    padding: 0,
  },
  card: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 440,
    borderTopWidth: 1,
    borderColor: '#302E35',
    padding: 32,
  },
  eyebrow: {
    color: '#C084FC',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  title: {
    color: '#FFF',
    fontFamily: 'Georgia',
    fontSize: 40,
    fontWeight: '500',
    marginBottom: 12,
  },
  description: {
    color: '#AAA6B0',
    maxWidth: 560,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#A855F7',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 22,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
