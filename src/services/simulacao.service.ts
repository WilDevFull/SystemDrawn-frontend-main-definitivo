import { api } from './api';

export interface SimulacaoResponse {
  sucesso: boolean;
  imagemSimulada: string;
  erro?: string;
}

export async function simularTatuagemIA(
  imagemCorpoBase64: string,
  promptText?: string
): Promise<SimulacaoResponse> {
  const response = await api.post<SimulacaoResponse>('/simulacao', {
    imagemCorpoBase64,
    promptText,
  });

  return response.data;
}