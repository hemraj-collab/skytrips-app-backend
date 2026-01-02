import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should register a new user', async () => {
      const signupDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };

      jest.spyOn(service, 'signup').mockImplementation(async () => ({
        user: {
          id: '1',
          email: signupDto.email,
          created_at: '2024-01-01T00:00:00.000Z',
        },
        session: {
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
          token_type: 'bearer',
          expires_in: 3600,
        },
      }));

      const result = await controller.signup(signupDto);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('session');
      expect(result.session).toHaveProperty('access_token');
      expect(result.session).toHaveProperty('refresh_token');
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(service, 'login').mockImplementation(async () => ({
        user: {
          id: '1',
          email: loginDto.email,
          created_at: '2024-01-01T00:00:00.000Z',
        },
        session: {
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
          token_type: 'bearer',
          expires_in: 3600,
        },
      }));

      const result = await controller.login(loginDto);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('session');
      expect(result.session).toHaveProperty('access_token');
      expect(result.session).toHaveProperty('refresh_token');
    });
  });
});
