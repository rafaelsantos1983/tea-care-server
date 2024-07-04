import { TenantDoc, logger, createDate } from '@teacare/tea-care-bfb-ms-common';
import { readFileSync } from 'fs';

export async function executeScripts(tenants: TenantDoc[]) {
  const changeLog = JSON.parse(
    readFileSync(`${__dirname}/changelog.json`, { encoding: 'utf8' })
  );

  for (const tenant of tenants) {
    if (!tenant.migrations) {
      tenant.migrations = [];
    }

    for (const migration of changeLog.migrations) {
      logger.debug(
        `[ms-report:migration-service] Verificar se executar o arquivo ${migration} no tenant ${tenant.name}`
      );

      if (!tenant.migrations.some((m) => m.fileName === migration)) {
        const script = await import(`${__dirname}/migrations/${migration}`);
        logger.debug(
          `[ms-report:migration-service] Executar script ${migration} do tenant ${tenant.name}`
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
