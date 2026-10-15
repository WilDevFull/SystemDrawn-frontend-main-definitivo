import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native-web';

type AgendaItem = {
  id: number;
  time: string;
  clientName: string;
  service: string;
};

const agendaItems: AgendaItem[] = [
  { id: 1, time: '09:00', clientName: 'Marina Costa', service: 'Tattoo blackwork' },
  { id: 2, time: '10:45', clientName: 'Pedro Silva', service: 'Piercing labret' },
  { id: 3, time: '12:30', clientName: 'Gabriela Lima', service: 'Tattoo floral' },
  { id: 4, time: '14:15', clientName: 'João Victor', service: 'Ajuste de joia' },
  { id: 5, time: '16:00', clientName: 'Camila Santos', service: 'Tatuagem realista' },
  { id: 6, time: '18:30', clientName: 'Thiago Martins', service: 'Piercing nostril' },
];

export default function AdminAgendaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda do dia</Text>

      <FlatList
        data={agendaItems}
        keyExtractor={(item: (typeof agendaItems)[number]) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: (typeof agendaItems)[number] }) => (
          <View style={styles.card}>
            <Text style={styles.time}>{item.time}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.clientName}>{item.clientName}</Text>
              <Text style={styles.service}>{item.service}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 18,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17171B',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C31',
  },
  time: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    width: 72,
  },
  cardContent: {
    flex: 1,
  },
  clientName: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  service: {
    color: '#B9B9BE',
    fontSize: 14,
  },
});
