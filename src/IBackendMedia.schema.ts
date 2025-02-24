import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IBackendMedia = HydratedDocument<IBackendMediaType>;

@Schema()
export class SeasonsType {
  @Prop()
  season: number;

  @Prop()
  episodes: number[];
}

@Schema()
export class IBackendMediaType {
  @Prop()
  type: string;

  @Prop()
  tmdbID: number;

  @Prop()
  streamName: string;

  @Prop()
  name: string;

  @Prop()
  tags: string[];

  @Prop()
  poster: string;

  @Prop()
  backdrop: string;

  @Prop({ type: [SeasonsType] })
  localSeasons?: SeasonsType[];

  @Prop({ type: [SeasonsType] })
  onlineSeasons?: SeasonsType[];

  @Prop()
  state: string;

  @Prop()
  hasErrors: boolean;
}

export const IBackendMedia = SchemaFactory.createForClass(IBackendMediaType);
