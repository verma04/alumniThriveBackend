enum type {
  virtual = "virtual",
  inPerson = "inPerson",
  hybrid = "hybrid",
}
enum visibility {
  private = "private",
  public = "public",
}
enum cost {
  free = "free",
  paid = "paid",
}
enum paymentMode {
  qrCode = "qrCode",
  paypal = "paypal",
  bankAccount = "bankAccount",
}

enum mediaType {
  video = "video",
  image = "image",
}
export interface eventForGroup {
  cover: any;
  accountNumber: string;
  bankName: string;
  costPerAdults: Number | any;
  costPerChildren: Number | any;
  currency: string;
  details: string;
  eventCost: cost;
  eventEndTime: Date | any;
  eventStartTime: Date | any;
  eventType: type;
  eventVisibility: visibility;
  group: string;
  ifscCode: string;
  name: string;
  paymentMode: paymentMode;
  paypalDetails: string;
  venue: string;
  registrationEndDate: Date | any;
  contactNumber: string;
  contactEmail: string;
}

export interface eventForGroupInput {
  input: eventForGroup;
}

interface item {
  title: string;
  description: string;
}

export interface createSponsorShip {
  id: string;
  type: string;
  currency: string;
  price: string;
  content: item[];
  slug: string;
  showPrice: boolean;
}

export interface eventCreateSponsorShip {
  input: createSponsorShip;
}

export interface addVenue {
  id: string;
  venue: string;
  address: string;
  event: string;
}

export interface addVenueProps {
  input: addVenue;
}

export interface addSpeaker {
  id: string;
  name: string;
  linkedin: string;
  cover: any;
  about: string;
  type: string;
  event: string;
  speaker: string;
}

export interface addSpeakerProps {
  input: addSpeaker;
  event: string;
}

export interface addAgenda {
  title: string;
  videoSteam: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  speakers: string[];
  isPinned: boolean;
  isDraft: boolean;
  isPublished: boolean;
  description: string;
  event: string;
}

export interface addAgendaProps {
  input: addAgenda;
}

export interface addMedia {
  mediaType: mediaType;
  file: [string];
  event: string;
}

export interface addMediaProps {
  input: addMedia;
}

export interface addSponsor {
  sponsorUserName: string;
  sponsorUserDesignation: string;
  sponsorLogo: string;
  sponsorShipId: string;
  sponsorName: string;
  event: string;
}

export interface addSponsorProps {
  input: addSponsor;
}
