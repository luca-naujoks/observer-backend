import { z } from 'zod';

export const MediaSchema = z.object({
  id: z.number(),
  type: z.string(),
  tmdb_id: z.string(),
  stream_name: z.string(),
  name: z.string(),
  poster: z.string(),
  backdrop: z.string(),
  online_available: z.boolean(),
});

export const MediaArraySchema = z.array(MediaSchema);

export const ZProvider = z.object({
  name: z.string(),
  fetchData: z.function(),
  trending: z.function().optional(),
  schedule: z.string(),
});
