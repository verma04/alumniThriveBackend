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
}

export interface eventCreateSponsorShip {
  input: createSponsorShip;
}
