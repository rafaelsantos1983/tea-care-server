import { Request, Response } from 'express';

export var tokenLanguageDetector = {
  name: 'TokenLanguageDetector',

  lookup: function (req: Request, res: Response, options?: any) {
    let language = (req as any).user?.language;

    if (language) {
      return language;
    } else {
      return 'en';
    }
  },
};
