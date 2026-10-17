import { api } from './api';


export const MEMBROS = ['Braço', 'Perna', 'Costas', 'Peito', 'Pescoço', 'Mão'] as const;
export type Membro = (typeof MEMBROS)[number];


const LIMITE_SIMULACAO_MS = 150000;

export interface SimulacaoResponse {
  sucesso: boolean;
  imagemSimulada: string;
  
  modoTeste?: boolean;
  erro?: string;
}

export async function simularTatuagemIA(
  imagemTatuagemBase64: string,
  membro: Membro,
  promptText?: string
): Promise<SimulacaoResponse> {
  const response = await api.post<SimulacaoResponse>(
    '/simulacao',
    { imagemTatuagemBase64, membro, promptText },
    { timeout: LIMITE_SIMULACAO_MS }
  );

  return response.data;
}
