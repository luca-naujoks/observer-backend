import { z } from 'zod';

const MediaSchema = z.object({
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
