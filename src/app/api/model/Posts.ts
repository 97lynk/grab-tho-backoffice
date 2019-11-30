import { Image } from './Image';
import { Accomodation } from './Accomodation';

export class Post {

  id: number;

  textDescription: string;

  imagesDescription: string[];

  address: string;

  createAt: Date;

  status: string;

  noReceiver: number;

  noQuote: number;

  feedBack: boolean;

  rate: number;

  comment: string;

  point: number;

  userId: number;

  userFullName: string;

  userAvatar: string;

  repairerId: number;
}
