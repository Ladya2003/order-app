export const formatPhone = (phone: string) => {
  const code = phone.slice(1, 4);
  const firstPart = phone.slice(4, 7);
  const secondPart = phone.slice(7, 9);
  const thirdPart = phone.slice(9, 11);

  return `+7 (${code}) ${firstPart}-${secondPart}-${thirdPart}`;
};
