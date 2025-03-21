import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class TrendingDTO {
  @IsNotEmpty({ message: 'Field id must be added' })
  @IsInt()
  id: number;

  @IsNotEmpty({ message: 'Field media_id must be added' })
  @IsInt()
  media_id: number;

  @IsNotEmpty({ message: 'Field type must be added' })
  @IsString()
  type: string;
}
