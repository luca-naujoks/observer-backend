import { IsInt, IsNotEmpty } from 'class-validator';

export class WatchListDto {
  @IsNotEmpty({ message: 'Field media_id must be added' })
  @IsInt()
  media_id: number;

  @IsNotEmpty({ message: 'Field user must be added' })
  @IsInt()
  user: number;
}
