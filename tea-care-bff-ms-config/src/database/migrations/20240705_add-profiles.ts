import {
  FunctionalityDoc,
  FunctionalitySchema,
  ProfileDoc,
  ProfileSchema,
  mongoWrapper,
} from '@teacare/tea-care-bfb-ms-common';

module.exports.exec = async (tenant: string) => {
  const Profile = await mongoWrapper.getModel<ProfileDoc>(
    tenant,
    'Profile',
    ProfileSchema
  );

  const Functionality = await mongoWrapper.getModel<FunctionalityDoc>(
    tenant,
    'Functionality',
    FunctionalitySchema
  );

  let funcionalityUserUpdate: any = await Functionality.findOne({
    symbol: 'USER_UPDATE',
  });
  let funcionalityPatientUpdate: any = await Functionality.findOne({
    symbol: 'PATIENT_UPDATE',
  });
  let funcionalityCareRegister: any = await Functionality.findOne({
    symbol: 'CARE_REGISTER',
  });

  let funcionalityDashboardInternal: any = await Functionality.findOne({
    symbol: 'DASHBOARD_INTERNAL',
  });
  let funcionalityDashboardExternal: any = await Functionality.findOne({
    symbol: 'DASHBOARD_EXTERNBAL',
  });

  let funcionalitiesAdministrator: FunctionalityDoc[] = [];
  funcionalitiesAdministrator.push(funcionalityUserUpdate);
  funcionalitiesAdministrator.push(funcionalityPatientUpdate);

  const administrador = new Profile({
    name: 'Administrador',
    symbol: 'ADM',
    functionalities: funcionalitiesAdministrator,
  });

  let funcionalitiesHealthProfessional: FunctionalityDoc[] = [];
  funcionalitiesHealthProfessional.push(funcionalityPatientUpdate);
  funcionalitiesHealthProfessional.push(funcionalityCareRegister);
  funcionalitiesHealthProfessional.push(funcionalityDashboardInternal);

  const healthProfessional = new Profile({
    name: 'Profissional de Saúde',
    symbol: 'HEALTH_PROFESSIONAL',
    functionalities: funcionalitiesHealthProfessional,
  });

  let funcionalitiesResponsible: FunctionalityDoc[] = [];
  funcionalitiesResponsible.push(funcionalityDashboardExternal);

  const responsible = new Profile({
    name: 'Responsável de Paciente',
    symbol: 'RESPONSIBLE',
    functionalities: funcionalitiesResponsible,
  });

  await administrador.save();
  await healthProfessional.save();
  await responsible.save();
};
