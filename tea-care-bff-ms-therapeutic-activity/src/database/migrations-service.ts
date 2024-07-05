import { TenantDoc, logger, createDate } from '@teacare/tea-care-bfb-ms-common';
import { readFileSync } from 'fs';

/**
 * Realiza a migração dos dados dos TS para o banco
 * @param tenants Tenants
 */
export async function migrations(tenants: TenantDoc[]) {
  const migrationLog = JSON.parse(
    readFileSync(`${__dirname}/migrationLog.json`, { encoding: 'utf8' })
  );

  for (const tenant of tenants) {
    if (!tenant.migrations) {
      tenant.migrations = [];
    }

    for (const migration of migrationLog.migrations) {
      logger.debug(
        `[ms-auth:migration] Processar o arquivo ${migration} do tenant ${tenant.name}`
      );

      if (!tenant.migrations.some((m) => m.fileName === migration)) {
        const script = await import(`${__dirname}/migrations/${migration}`);
        logger.debug(
          `[ms-auth:migration] Executar script ${migration} do tenant ${tenant.name}`
        );
        await script.exec(tenant.name);
        tenant.migrations.push({
          fileName: migration,
          dateExecuted: createDate(),
        });
      }
    }

    await tenant.save();
  }
}
