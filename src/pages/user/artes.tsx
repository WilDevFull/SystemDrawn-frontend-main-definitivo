// src/pages/user/artes.tsx
import { useRouter } from '@/lib/navigation';
import { simularTatuagemIA } from '@/services/simulacao.service';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native-web';

export default function ArtesScreen() {
  const router = useRouter();

  const [imagemOriginal, setImagemOriginal] = useState<string | null>(null);
  const [promptText, setPromptText] = useState<string>(
    'photorealistic black ink tattoo applied on human skin, high quality'
  );
  const [imagemSimulada, setImagemSimulada] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  // 1. Redimensiona a foto no navegador (máx 768px) e converte para Base64 leve
  const processarImagemWeb = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const MAX_SIZE = 768;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Erro ao processar a imagem.'));
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    });
  };

  // 2. Abre o seletor de arquivos do navegador
  const handleSelecionarFoto = () => {
    setMensagemErro(null);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event: any) => {
      const file = event.target?.files?.[0];
      if (!file) return;

      try {
        const base64Otimizado = await processarImagemWeb(file);
        setImagemOriginal(base64Otimizado);
        setImagemSimulada(null);
      } catch {
        setMensagemErro('Não foi possível carregar a imagem selecionada.');
      }
    };

    input.click();
  };

  // 3. Envia para o Backend (/simulacao)
  const handleSimular = async () => {
    if (!imagemOriginal) {
      setMensagemErro('Por favor, selecione uma foto do corpo ou rascunho primeiro.');
      return;
    }

    try {
      setCarregando(true);
      setMensagemErro(null);

      const resposta = await simularTatuagemIA(imagemOriginal, promptText);

      if (resposta.sucesso && resposta.imagemSimulada) {
        setImagemSimulada(resposta.imagemSimulada);
      } else {
        setMensagemErro(resposta.erro || 'A IA não conseguiu gerar a simulação.');
      }
    } catch (error: any) {
      console.error('Erro ao conectar com o backend:', error);
      const msgServidor = error?.response?.data?.erro;
      setMensagemErro(
        msgServidor ||
          'Erro ao conectar com o servidor. Verifique se o seu Backend está rodando na porta 3000.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Inteligência Artificial • ControlNet</Text>
        <Text style={styles.title}>Simulador de Tatuagem</Text>
        <Text style={styles.description}>
          Envie uma foto da região do corpo ou do desenho base (rascunho) e descreva o estilo desejado para simular o resultado com IA.
        </Text>

        {/* PASSO 1: ESCOLHER IMAGEM */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleSelecionarFoto}>
          <Text style={styles.uploadButtonText}>
            {imagemOriginal ? 'Trocar Imagem Base' : '1. Selecionar Foto / Rascunho'}
          </Text>
        </TouchableOpacity>

        {/* PASSO 2: DESCREVER O PROMPT */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            2. Descrição da Tatuagem (em inglês gera melhores resultados):
          </Text>
          <TextInput
            style={styles.input}
            value={promptText}
            onChangeText={setPromptText}
            placeholder="Ex: blackwork floral tattoo on human skin"
            placeholderTextColor="#666"
          />
        </View>

        {/* AVISO DE ERRO */}
        {mensagemErro && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{mensagemErro}</Text>
          </View>
        )}

        {/* PASSO 3: BOTÃO DE SIMULAR */}
        <TouchableOpacity
          style={[styles.button, (!imagemOriginal || carregando) && styles.buttonDisabled]}
          onPress={handleSimular}
          disabled={!imagemOriginal || carregando}
        >
          {carregando ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.buttonText}>
                Processando no Hugging Face (pode levar 20s)...
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>3. Gerar Simulação com IA</Text>
          )}
        </TouchableOpacity>

        {/* COMPARAÇÃO LADO A LADO */}
        {(imagemOriginal || imagemSimulada) && (
          <View style={styles.resultsGrid}>
            {imagemOriginal && (
              <View style={styles.imageBox}>
                <Text style={styles.imageTitle}>Imagem Enviada:</Text>
                <Image
                  source={{ uri: imagemOriginal }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {imagemSimulada && (
              <View style={styles.imageBox}>
                <Text style={styles.imageTitle}>Resultado da IA:</Text>
                <Image
                  source={{ uri: imagemSimulada }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/novo-agendamento')}
        >
          <Text style={styles.secondaryButtonText}>Ir para Agendamento</Text>
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
    maxWidth: 640,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 28,
  },
  uploadButton: {
    backgroundColor: '#17171B',
    borderWidth: 1,
    borderColor: '#A855F7',
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 22,
  },
  uploadButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    color: '#C4BFCA',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#111114',
    borderWidth: 1,
    borderColor: '#302E35',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFF',
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: '#2A1010',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 5,
    padding: 14,
    marginBottom: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#A855F7',
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 28,
  },
  imageBox: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#111114',
    borderRadius: 5,
    padding: 16,
    borderWidth: 1,
    borderColor: '#302E35',
    alignItems: 'center',
  },
  imageTitle: {
    color: '#C084FC',
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: 320,
    borderRadius: 5,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#49454F',
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    color: '#C4BFCA',
    fontWeight: '700',
    fontSize: 14,
  },
});