import { Response, NextFunction, Request } from 'express';
import { UnauthorizedError } from './../errors/unauthorized-error';
import { logger } from './../util/logger';
import { Grants } from './../enum/grants';
import { getUserAuth } from '../..';

/** Função responsável por verificar se o usuário tem o perfil necessário para a funcionalidade. */
const accessControl =
  (permissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let hasAccess: boolean = false;
      for (const permission of permissions) {
        const resources: string[] = getUserAuth(req)
          .split(',')
          .filter((auth?: any) => auth.startsWith(permission));

        hasAccess = validateAccessToResource(req.method, resources);
        if (hasAccess) {
          hasAccess = true;
          break;
        }
      }
      if (!hasAccess) {
        throw new UnauthorizedError('Not Authorized.');
      }
      next();
    } catch (err) {
      logger.error('access-control - {}', err);
      const error = err as UnauthorizedError;
      res.status(401).send({ message: error.message });
    }
  };

function validateAccessToResource(
  methodInvocation: string,
  resources: string[]
): boolean {
  let accessAllowed: boolean = false;
  if (resources != null && resources.length) {
    for (const resource of resources) {
      const grantsResource: string[] = resource.split('::');
      let noAccess: boolean = false;
      if (grantsResource.length > 1) {
        const grants: string = resource.split('::')[1];
        noAccess =
          grants === Grants.NONE ||
          (methodInvocation != 'GET' && grants != Grants.WRITE);
      }
      if (!noAccess) {
        accessAllowed = true;
        break;
      } else {
        accessAllowed = false;
      }
    }
  }
  return accessAllowed;
}

export { accessControl };
