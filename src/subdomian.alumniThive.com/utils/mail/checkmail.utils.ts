const tempEmailDomains = [
  "mailinator.com",
  "duck.com",
  "gmail.com",
  "outlook.com",
  // add more temp email domains here
];

export const checkEmail = (email: string) => {
  const domain = email.split("@")[1];
  console.log(domain);
  return tempEmailDomains.includes(domain);
};
