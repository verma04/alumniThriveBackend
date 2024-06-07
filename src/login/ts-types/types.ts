export interface googleLogin {
  name: string;
  avatar: string;
  googleId: string;
  email: string;
  domain: string;
}

export interface googleLoginInput {
  input: googleLogin;
}

export interface profile {
  country: string;
  language: string;
  phone: phone;
  timeZone: string;
  fistName: string;
  lastName: string;
  email: string;
  DOB: string;
}
export interface about {
  currentPosition: string;
  linkedin: string;
  instagram: string;
  portfolio: string;
}
export interface education {
  id: string;
  school: string;
  degree: string;
  grade: string;
  activities: string;
  description: string;
  duration: [String];
}

export interface experience {
  id: string;
  companyName: string;
  duration: [String];
  employmentType: string;
  location: string;
  locationType: string;
  title: string;
}
export interface phone {
  areaCode: string;
  countryCode: Number;
  isoCode: string;
  phoneNumber: string;
}

export interface profileCreation {
  profile: profile;
  about: about;
  education: [education];
  experience: [experience];
}

export interface profileCreationInput {
  input: profileCreation;
}

export interface emailLogin {
  email: string;
  domain: string;
}

export interface emailLoginInput {
  input: emailLogin;
}
