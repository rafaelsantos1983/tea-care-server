import { createConnection, Connection, Schema, Model } from 'mongoose';
import { TenantType } from '../..';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { ServiceName } from '../models/tenants/service-name';
import { TenantDoc, TenantSchema } from '../models/tenants/tenant';
import { logger } from '../util/logger';

const mongoOptions = {
  maxPoolSize: 300,
  connectTimeoutMS: 60000,
};

// Cria conexão a partir de um URI
const connect = async (mongoUri: any, tenant: string, database: string) => {
  if (mongoUri) {
    try {
      const connection = await createConnection(mongoUri, mongoOptions);
      console.log(
        `[ms-common:mongo] Conexão com o MongoDB criada com sucesso para ${database} do tenant ${tenant}.`
      );
      return connection;
    } catch (err) {
      logger.error(
        `[ms-common:mongo] Falha ao conectar com o MongoDB do tenant ${tenant} do ${database}. Error: ${err}`
      );
      throw new DatabaseConnectionError();
    }
  } else {
    throw new DatabaseConnectionError();
  }
};

export interface IMongoWrapper {
  connectToMongo: (
    serviceName: ServiceName
  ) => Promise<TenantDoc[] | undefined>;
  getModel: <T>(
    tenant: string,
    modelName: string,
    modelSchema: Schema<T>
  ) => Model<any, {}, {}> | Model<T, {}, {}>;
  getTenants: (tenantsDatabase: Connection) => Promise<TenantDoc[]>;
}

class MongoWrapper implements IMongoWrapper {
  connectMongo = (mongoUri: any) => {
    if (mongoUri) {
      return createConnection(mongoUri, mongoOptions);
    } else {
      throw new DatabaseConnectionError();
    }
  };

  // Map de conexões (tenant -> conexão)
  private _tenantConnections: Map<string, Connection> = new Map<
    string,
    Connection
  >();

  /**
   * Verifica se existe o Tenants
   */
  hasTenant(tenant: string) {
    let result = false;
    const tenants = Object.values(TenantType);
    tenants.forEach((value, index) => {
      if (tenant === value) {
        result = true;
      }
    });
    return result;
  }

  get tenantConnections() {
    if (this._tenantConnections.size === 0) {
      throw new DatabaseConnectionError();
    } else {
      return this._tenantConnections;
    }
  }

  // Conecta com o banco dos tenants e recupera as informações para cada tenant
  async connectToMongo(serviceName: ServiceName) {
    let tenants: TenantDoc[];
    try {
      console.log(`[ms-common:mongo] Criando conexão com os tenants.`);
      const tenantsDatabase = await connect(
        process.env.MONGO_URI,
        '',
        'tenantsDatabase'
      );
      tenants = await this.getTenants(tenantsDatabase);
      console.log(
        `[ms-common:mongo] Conexão estabelecida com os tenants: ${JSON.stringify(
          tenants.map((t) => t.name)
        )}`
      );
      for (let tenant of tenants) {
        let tenantConnection;

        if (serviceName === ServiceName.configurator) {
          tenantConnection = await connect(
            tenant.configuratorUri,
            tenant.name,
            'configurator'
          );
        } else if (serviceName === ServiceName.therapeuticActivity) {
          tenantConnection = await connect(
            tenant.therapeuticActivityUri,
            tenant.name,
            'therapeuticActivity'
          );
        } else if (serviceName === ServiceName.dashboard) {
          tenantConnection = await connect(
            tenant.dashboardUri,
            tenant.name,
            'dashboard'
          );
        } else if (serviceName === ServiceName.report) {
          tenantConnection = await connect(
            tenant.reportUri,
            tenant.name,
            'report'
          );
        } else if (serviceName === ServiceName.auth) {
          tenantConnection = await connect(tenant.authUri, tenant.name, 'auth');
        } else {
          throw new DatabaseConnectionError();
        }

        console.log(
          `[ms-common:mongo] Conectado ao DB no tenant: ${tenant.name} do serviço ${serviceName}.`
        );
        this._tenantConnections.set(tenant.name, tenantConnection);
      }
      return tenants;
    } catch (err) {
      logger.error(
        `[ms-common:mongo] Erro ao conectar com Mongo no serviceName ${serviceName}`,
        err
      );
    }
  }

  // Retorna um Model para a conexão do tenant
  getModel<T>(tenant: string, modelName: string, modelSchema: Schema<T>) {
    let tenantConn = this._tenantConnections.get(tenant);
    if (tenantConn) {
      return tenantConn.models[modelName]
        ? (tenantConn.models[modelName] as Model<T>)
        : tenantConn.model<T>(modelName, modelSchema);
    } else {
      throw new Error(
        `[ms-common:mongo] Erro ao tentar recuperar tenant ${tenant}`
      );
    }
  }

  // Recupera tenants
  async getTenants(tenantsDataBase: Connection) {
    const Tenant = await tenantsDataBase.model<TenantDoc>(
      'Tenant',
      TenantSchema
    );
    return await Tenant.find({});
  }
}

export const mongoWrapper = new MongoWrapper();
