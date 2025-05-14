import { IsNotEmpty, IsString } from 'class-validator';

export class Provider {
  @IsNotEmpty({ message: 'Field name must be added' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Field type must be added' })
  @IsString()
  enabled: string;
}
