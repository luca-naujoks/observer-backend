import { IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

export class LocalSeasonDTO {
  @IsNotEmpty({ message: 'Field id must be added' })
  @IsInt()
  id: number;

  @IsNotEmpty({ message: 'Field media_id must be added' })
  @IsInt()
  media_id: number;

  @IsNotEmpty({ message: 'Field season must be added' })
  @IsInt()
  season: number;

  @IsNotEmpty({ message: 'Field episode must be added' })
  @IsInt()
  episode: number;

  @IsNotEmpty({ message: 'Field attention must be added' })
  @IsBoolean()
  attention: boolean;
}
