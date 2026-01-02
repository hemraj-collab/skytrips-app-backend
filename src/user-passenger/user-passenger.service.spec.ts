import { Test, TestingModule } from '@nestjs/testing';
import { UserPassengerService } from './user-passenger.service';

describe('UserPassengerService', () => {
  let service: UserPassengerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPassengerService],
    }).compile();

    service = module.get<UserPassengerService>(UserPassengerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
