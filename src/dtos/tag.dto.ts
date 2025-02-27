import { IsInt, IsNotEmpty } from 'class-validator';

export class TagDto {
  @IsNotEmpty({ message: 'Field stream_name must be added' })
  @IsInt()
  id: number;

  @IsNotEmpty({ message: 'Field tag_id must be added' })
  @IsInt()
  tag_id: number;
}
