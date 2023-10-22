export const userSearchSchema = {
  active: 'u.isActive',
};

export const userSearchTermsFields = [
  'u.email',
  "CONCAT(u.firstName, ' ', u.lastName)",
];

export const legacyFieldsSchema = {
  companyId: 'u.companyId',
  userId: 'u.id',
};
