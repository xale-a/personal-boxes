import { Timestamp } from 'firebase/firestore';

export type BoxFront = {
  boxid: string;
  ownerid: string;
  createdAt: Timestamp;
  frontURL: string;
  unlocked: boolean;
};

export type BoxContent = {
  items: [{
    name: string;
    type: string;
    size: number;
    url: string;
  }];
};

export type Box = BoxFront & BoxContent & {
  key?: string;
};

// export type Box = {
//   id: string;
//   createdAt: Timestamp;
//   ownerId: string;
//   frontURL: string;
//   unlocked: boolean;
//   items?: [{
//     name: string;
//     type: string;
//     size: number;
//     url: string;
//   }];
// };

