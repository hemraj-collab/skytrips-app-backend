import { Test, TestingModule } from '@nestjs/testing';
import { UserPassengerController } from './user-passenger.controller';

describe('UserPassengerController', () => {
  let controller: UserPassengerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPassengerController],
    }).compile();

    controller = module.get<UserPassengerController>(UserPassengerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
