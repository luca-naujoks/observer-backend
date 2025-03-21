import { IsInt, IsNotEmpty } from 'class-validator';

export class TagDto {
  @IsNotEmpty({ message: 'Field media_id must be added' })
  @IsInt()
  media_id: number;

  @IsNotEmpty({ message: 'Field tag_id must be added' })
  @IsInt()
  tag_id: number;
}
