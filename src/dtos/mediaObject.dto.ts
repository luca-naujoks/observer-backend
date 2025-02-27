import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class MediaObjectDTO {
  @IsNotEmpty({ message: 'Field id must be added' })
  @IsInt()
  id: number;

  @IsNotEmpty({ message: 'Field type must be added' })
  @IsString()
  type: string;

  @IsNotEmpty({ message: 'Field tmdb_id must be added' })
  @IsInt()
  tmdb_id: number;

  @IsNotEmpty({ message: 'Field stream_name must be added' })
  @IsString()
  stream_name: string;

  @IsNotEmpty({ message: 'Field name must be added' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Field poster must be added' })
  @IsString()
  poster: string;

  @IsNotEmpty({ message: 'Field backdrop must be added' })
  @IsString()
  backdrop: string;
}

export class UpdateMediaObjectDTO {
  @IsNotEmpty({ message: 'Field tmdb_id must be added' })
  @IsInt()
  tmdb_id: number;
}
