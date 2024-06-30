import { Request } from 'express';
import { TenantType } from '../models/tenants/tenant-type';

/**
 * Trunca o valor em duas cadas decimais
 * @param value
 */
export function truncCurrency(value: Number) {
  return value.toFixed(2);
}

/**
 * Conveter o array para string com vírgula
 * @param array
 */
export function arrayToCommaTextQuoted(array: any) {
  if (array === null) {
    return '';
  }

  let result = ``;
  array.forEach(function (element: any, i: any) {
    result += `'` + element + `'`;
    if (i < array.length - 1) {
      result += `,`;
    }
  });
  return result;
}

/**
 * Retira os '.', '/' e '-' de um CNPJ.
 * @param value
 */
export function normalizeCNPJNumber(value: String) {
  return value
    .replace('.', '')
    .replace('.', '')
    .replace('/', '')
    .replace('-', '');
}

/**
 * Formata um CNPJ.
 * @param value
 */
export function formatCnpjNumber(value: String) {
  const mask = '##.###.###/####-##';
  const defautCharacter = '#';
  let result: String = '';
  let i: number;
  let j: number;

  if (value && value.length < 15) {
    i = value.length;
    j = mask.length;
    while (i > 0) {
      if (
        mask.substring(j - 1, j).toUpperCase() === defautCharacter.toUpperCase()
      ) {
        result = value.substring(i - 1, i) + result.trim();
        i--;
        j--;
      } else {
        result = mask.substring(j - 1, j) + result.trim();
        j--;
      }
    }
    result = mask.substring(0, mask.indexOf(defautCharacter)) + result;
  }

  return result;
}

export function createDate() {
  const today = new Date(Date.now());
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today;
}

/**
 * Sanitiza a entrada de uma string
 *
 * @export
 * @param {string} value
 * @return {*}
 */
export function sanitizeString(
  value: string | null | undefined
): string | null {
  return value ? escape(value.trim()) : null;
}

export function sanitizeArray(
  value: string[] | null | undefined
): string[] | null {
  return value
    ? value.map((item: string) => sanitizeString(item) as string)
    : null;
}

/**
 * Método para colocar await em milisegundos
 * @param ms
 * @returns
 */
export function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function getUserTenant(req: any): string {
  return (req as any).headers?.constituent;
}

/**
 * Pega o auth do usuário na requisição
 * @param req
 * @returns
 */
export function getUserAuth(req: Request): string {
  return (req as any).user?.auth;
}

/**
 * Pega o language do usuário na requisição
 * @param req
 * @returns
 */
export function getUserLanguage(req: Request): string {
  return (req as any).user?.language;
}

/**
 * Retorna a origem
 * @param req
 * @returns
 */
export function getOrigin(req: any): string {
  return req.get('origin');
}

/**
 * Retorna o Tenant da origem
 * @param req
 * @returns
 */
export function getTenantByOrigin(req: any): string {
  let tenant = TenantType.PRAXIS;

  return req.get('origin');
}

/**
 * Gerar Senha
 * @returns
 */
export function generatePassword() {
  return Math.random().toString(36).slice(-10);
}
