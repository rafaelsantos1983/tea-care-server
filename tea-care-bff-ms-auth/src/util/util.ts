import { i18n } from './i18n';

/**
 * Pega a mensagem de acordo com a tradução
 * @param key
 * @param lang
 * @returns
 */
export function getMessage(req: any, key: string) {
  let language = getUserLanguage(req);
  return i18n.t(key, {
    ns: 'errors',
    lng: language,
  });
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
 * Trunca o valor em duas cadas decimais
 * @param value
 */
export function truncCurrency(value: Number) {
  return value.toFixed(2);
}
