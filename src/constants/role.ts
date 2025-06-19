export const userRoleType = {
  driver: 1,
  admin: 2,
  supervisor: 3,
  others: 4,
};

export const roleTypes = [
  { name: "Admin", value: userRoleType.admin },
  { name: "Driver", value: userRoleType.driver },
  { name: "Supervisor", value: userRoleType.supervisor },
  { name: "Others/custom", value: userRoleType.others },
];
