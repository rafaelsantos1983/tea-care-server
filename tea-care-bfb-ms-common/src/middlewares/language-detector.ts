import { Request, Response } from 'express';
import { LanguageDetectorInterface, LanguageDetectorInterfaceOptions } from 'i18next-http-middleware';

export class TokenLanguageDetector implements LanguageDetectorInterface {

  name: string = 'TokenLanguageDetector';

  lookup (req: Request, res: Response, options?: LanguageDetectorInterfaceOptions) : string | string[] | undefined {
    if((req as any)?.user?.language) {
      return (req as any).user.language;
    } else {
      return 'en';
    }
  };

}