export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: IUserRole;
  provider: IUserProvider;
  age?: number;
  phone?: string;
  gender?: string;
  identificationCard?: string;
  country?: string;
  city?: string;
  weight?: number;
  height?: number;
  // TODO: Agregar estos campos
  // followers?: DocumentReference[];
  // following?: DocumentReference[];
  // likes?: DocumentReference[];
  // photoUrl?: string;
  // photoFilename?: string;
  // bannerUrl?: string;
  // bannerFilename?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum IUserProvider {
  EMAIL = 'email-password',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum IUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
