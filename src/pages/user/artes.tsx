// src/pages/user/artes.tsx
import { useRouter } from '@/lib/navigation';
import { MEMBROS, simularTatuagemIA, type Membro } from '@/services/simulacao.service';
import React, { useEffect, useRef, useState } from 'react';
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
  const [membro, setMembro] = useState<Membro>('Braço');
  const [promptText, setPromptText] = useState<string>('black ink tattoo');
  const [imagemSimulada, setImagemSimulada] = useState<string | null>(null);
  const [modoTeste, setModoTeste] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  
  const pedidoAtual = useRef(0);
  const resultadoRef = useRef<any>(null);

  
  useEffect(() => {
    if (imagemSimulada) {
      resultadoRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    }
  }, [imagemSimulada]);

  
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

          if (!width || !height) {
            reject(new Error('Imagem sem tamanho.'));
            return;
          }

          if (width > height && width > MAX_SIZE) {
            height = Math.max(1, Math.round((height * MAX_SIZE) / width));
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.max(1, Math.round((width * MAX_SIZE) / height));
            height = MAX_SIZE;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Erro ao processar a imagem.'));
            return;
          }

          
          
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Erro ao processar a imagem.'));
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    });
  };

  
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
        // Um pedido que ainda esteja em andamento era do desenho antigo: é descartado.
        pedidoAtual.current++;
        setCarregando(false);
        setImagemOriginal(base64Otimizado);
        setImagemSimulada(null);
      } catch {
        setMensagemErro('Não foi possível carregar a imagem selecionada.');
      }
    };

    input.click();
  };

  
  const handleEscolherMembro = (item: Membro) => {
    if (item === membro) return;
    pedidoAtual.current++;
    setMembro(item);
    setImagemSimulada(null);
    setMensagemErro(null);
  };

  
  const handleSimular = async () => {
    if (!imagemOriginal) {
      setMensagemErro('Por favor, selecione o desenho da tatuagem primeiro.');
      return;
    }

    const id = ++pedidoAtual.current;

    try {
      setCarregando(true);
      setMensagemErro(null);
      setImagemSimulada(null);

      const resposta = await simularTatuagemIA(imagemOriginal, membro, promptText);
      if (id !== pedidoAtual.current) return;

      if (resposta.sucesso && resposta.imagemSimulada) {
        setImagemSimulada(resposta.imagemSimulada);
        setModoTeste(Boolean(resposta.modoTeste));
      } else {
        setMensagemErro(resposta.erro || 'A IA não conseguiu gerar a simulação.');
      }
    } catch (error: any) {
      if (id !== pedidoAtual.current) return;
      console.error('Erro ao conectar com o backend (porta 3000):', error);
    
      const msgServidor = error?.response?.data?.erro || error?.response?.data?.message;

      if (msgServidor) {
        setMensagemErro(msgServidor);
      } else if (error?.code === 'ECONNABORTED') {
        setMensagemErro('A IA demorou demais para responder. Tente novamente em instantes.');
      } else {
        setMensagemErro('Não foi possível falar com o servidor agora. Tente novamente em instantes.');
      }
    } finally {
      if (id === pedidoAtual.current) setCarregando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Inteligência Artificial • ControlNet</Text>
        <Text style={styles.title}>Simulador de Tatuagem</Text>
        <Text style={styles.description}>
          Envie o desenho da tatuagem que você quer, escolha onde no corpo e veja uma prévia de como ela ficaria.
        </Text>

        {/* PASSO 1: ESCOLHER O DESENHO */}
        <TouchableOpacity
          style={[styles.uploadButton, carregando && styles.buttonDisabled]}
          onPress={handleSelecionarFoto}
          disabled={carregando}
        >
          <Text style={styles.uploadButtonText}>
            {imagemOriginal ? '1. Trocar desenho' : '1. Selecionar desenho da tatuagem'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          Dica: desenhos com fundo branco ou transparente ficam melhores.
        </Text>

        {/* PASSO 2: ESCOLHER O MEMBRO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>2. Onde no corpo?</Text>
          <View style={styles.membrosRow}>
            {MEMBROS.map((item) => {
              const selecionado = membro === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.membroOption,
                    selecionado && styles.membroSelected,
                    carregando && styles.buttonDisabled,
                  ]}
                  onPress={() => handleEscolherMembro(item)}
                  disabled={carregando}
                  role="button"
                  aria-pressed={selecionado}
                >
                  <Text style={[styles.membroText, selecionado && styles.membroTextSelected]}>
                    {selecionado ? `✓ ${item}` : item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* PASSO 3: DESCREVER O ESTILO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            3. Estilo da tatuagem (opcional, em inglês gera melhores resultados):
          </Text>
          <TextInput
            style={styles.input}
            value={promptText}
            onChangeText={setPromptText}
            editable={!carregando}
            aria-label="Estilo da tatuagem"
            placeholder="Ex: blackwork floral tattoo, fine line"
            placeholderTextColor="#666"
          />
        </View>

        {/* AVISO DE ERRO */}
        {mensagemErro && (
          <View style={styles.errorBox} role="alert">
            <Text style={styles.errorText}>{mensagemErro}</Text>
          </View>
        )}

        {/* PASSO 4: BOTÃO DE SIMULAR */}
        <TouchableOpacity
          style={[styles.button, !imagemOriginal && styles.buttonDisabled]}
          onPress={handleSimular}
          disabled={!imagemOriginal || carregando}
        >
          {carregando ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.buttonText}>
                Gerando a simulação (pode levar até 2 minutos)...
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>4. Gerar simulação em: {membro}</Text>
          )}
        </TouchableOpacity>

        {/* COMPARAÇÃO LADO A LADO */}
        {(imagemOriginal || imagemSimulada) && (
          <View style={styles.resultsGrid}>
            {imagemOriginal && (
              <View style={styles.imageBox}>
                <Text style={styles.imageTitle}>Seu desenho:</Text>
                <Image
                  source={{ uri: imagemOriginal }}
                  aria-label="Desenho enviado"
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {imagemSimulada && (
              <View style={styles.imageBox} ref={resultadoRef}>
                <Text style={styles.imageTitle}>
                  {modoTeste ? `Prévia em: ${membro} (modo de teste)` : `Resultado da IA em: ${membro}`}
                </Text>
                <Image
                  source={{ uri: imagemSimulada }}
                  aria-label={`Simulação da tatuagem em: ${membro}`}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
                {modoTeste && (
                  <Text style={styles.testNotice}>
                    Modo de teste: esta imagem é só o desenho colado na foto, sem a IA.
                  </Text>
                )}
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
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  hint: {
    color: '#8A8590',
    fontSize: 13,
    marginBottom: 22,
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
  membrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  membroOption: {
    backgroundColor: '#17171B',
    borderWidth: 1,
    borderColor: '#302E35',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  membroSelected: {
    backgroundColor: '#2A1B3D',
    borderColor: '#A855F7',
  },
  membroText: {
    color: '#C4BFCA',
    fontWeight: '600',
    fontSize: 14,
  },
  membroTextSelected: {
    color: '#FFF',
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
  testNotice: {
    color: '#FBBF24',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
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
