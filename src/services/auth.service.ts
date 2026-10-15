import { api }
from './api';

export async function
login(cpf: string) {

  const response =
    await api.post(
      '/auth/login',
      {
        cpf,
      }
    );

  return response.data;
}

export async function
register(
  cpf: string,
  nomeCompleto: string
) {

  const response =
    await api.post(
      '/auth/register',
      {
        cpf,
        nomeCompleto,
      }
    );

  return response.data;
}

export async function
checkCpf(
  cpf: string
) {

  const response =
    await api.post(
      '/auth/check-cpf',
      {
        cpf,
      }
    );

  return response.data;
}

export async function
getMe(token: string) {

  const response =
    await api.get(
      '/auth/me',
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
}