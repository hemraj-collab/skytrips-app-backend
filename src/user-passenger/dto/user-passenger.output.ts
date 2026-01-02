import { IPagination } from 'src/common/pagination';
import { UserPassengerEntity } from '../entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserPassengerOutput {
  @ApiProperty({
    description: 'List of user passengers',
    type: [UserPassengerEntity],
  })
  data: UserPassengerEntity[];

  @ApiProperty({
    description: 'Pagination information',
    type: IPagination,
  })
  meta: IPagination;
}
