import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native-web';

type PendingRequest = {
  id: number;
  clientName: string;
  style: string;
  date: string;
  time: string;
  duration: string;
};

const initialRequests: PendingRequest[] = [
  {
    id: 1,
    clientName: 'Ana Paula Souza',
    style: 'Tribal minimalista',
    date: '12/09/2026',
    time: '10:30',
    duration: '2h30',
  },
  {
    id: 2,
    clientName: 'Lucas Mendes',
    style: 'Florais finos',
    date: '12/09/2026',
    time: '13:00',
    duration: '1h45',
  },
  {
    id: 3,
    clientName: 'Beatriz Rocha',
    style: 'Blackwork realista',
    date: '13/09/2026',
    time: '15:45',
    duration: '3h',
  },
  {
    id: 4,
    clientName: 'Rafael Nunes',
    style: 'Linha fina',
    date: '14/09/2026',
    time: '18:15',
    duration: '2h',
  },
];

export default function AdminApprovalsScreen() {
  const [requests, setRequests] = useState(initialRequests);

  const totalPending = useMemo(() => requests.length, [requests]);

  const handleAction = (id: number) => {
    setRequests((current) => current.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aprovações</Text>
        <Text style={styles.counter}>{totalPending} pendentes</Text>
      </View>

      <TouchableOpacity
        style={styles.stockButton}
        onPress={() => {}}
      >
        <Text style={styles.stockButtonText}>Controle de Estoque de Materiais</Text>
      </TouchableOpacity>

      <FlatList
        data={requests}
        keyExtractor={(item: (typeof requests)[number]) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: (typeof requests)[number] }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.clientName}>{item.clientName}</Text>
              <Text style={styles.style}>{item.style}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.value}>{item.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Horário:</Text>
              <Text style={styles.value}>{item.time}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Duração:</Text>
              <Text style={styles.value}>{item.duration}</Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleAction(item.id)}
              >
                <Text style={styles.actionText}>Aprovar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleAction(item.id)}
              >
                <Text style={styles.actionText}>Recusar</Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
  },
  counter: {
    color: '#B7B7B7',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 28,
  },
  stockButton: {
    backgroundColor: '#1D1D1D',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#3B3B3B',
  },
  stockButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#17171B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C31',
  },
  cardHeader: {
    marginBottom: 14,
  },
  clientName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  style: {
    color: '#D4D4D4',
    fontSize: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#98989D',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#1F7A47',
  },
  rejectButton: {
    backgroundColor: '#A52A2A',
  },
  actionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
