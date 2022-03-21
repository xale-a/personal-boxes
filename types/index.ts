import { Timestamp } from 'firebase/firestore';

export type BoxFrontType = {
  boxid: string;
  ownerid: string;
  frontURL: string;
  unlocked: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type BoxContentType = {
  items: [{
    name: string;
    type: string;
    size: number;
    url: string;
  }];
};

export type BoxType = BoxFrontType & BoxContentType & {
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

