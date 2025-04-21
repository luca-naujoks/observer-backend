import { IsNotEmpty, IsString } from 'class-validator';

// used to create Logs
export class LogDto {
  @IsNotEmpty({ message: 'Field type must be added' })
  @IsString()
  type: string;

  @IsNotEmpty({ message: 'Field user must be added' })
  @IsString()
  user: string;

  @IsNotEmpty({ message: 'Field message must be added' })
  @IsString()
  message: string;
}
