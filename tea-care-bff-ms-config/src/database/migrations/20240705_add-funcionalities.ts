import {
  FunctionalityDoc,
  FunctionalitySchema,
  mongoWrapper,
} from '@teacare/tea-care-bfb-ms-common';

module.exports.exec = async (tenant: string) => {
  const Functionality = await mongoWrapper.getModel<FunctionalityDoc>(
    tenant,
    'Functionality',
    FunctionalitySchema
  );

  const patientsUpdate = new Functionality({
    name: 'Cadastro de Pacientes',
    symbol: 'PATIENT_UPDATE',
  });

  const usersUpdate = new Functionality({
    name: 'Cadastro de Usuários',
    symbol: 'USER_UPDATE',
  });

  const careRegister = new Functionality({
    name: 'Realizar Atendimento',
    symbol: 'CARE_REGISTER',
  });

  const dashboardInternal = new Functionality({
    name: 'Dashboard Internal',
    symbol: 'DASHBOARD_INTERNAL',
  });

  const dashboardExternal = new Functionality({
    name: 'Dashboard Externo',
    symbol: 'DASHBOARD_EXTERNBAL',
  });

  await patientsUpdate.save();
  await usersUpdate.save();
  await careRegister.save();
  await dashboardInternal.save();
  await dashboardExternal.save();
};
