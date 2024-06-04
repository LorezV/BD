import { IUser } from "@/store";

export interface IPodcast {
  id: number;
  header: string;
  description: string;
  coverLink: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  categoryId: number | null;
  authorId: number;
  Author: IUser;
}

export interface IPodcastCategory {
  id: number;
  name: string;
}

export interface IStream {
  id: number;
  header: string;
  description: string;
  coverLink: string;
  postLink: string;
  startDate: string;
  endDate: Date | null;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  typeId: number;
  podcastId: number;
  Podcast: IPodcast;
}

export interface IStreamType {
  id: number;
  name: string;
}
