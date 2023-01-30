import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;

  let fakeUserService: Partial<UsersService>;

  let users: Array<User> = [];

  beforeEach(async () => {
    users = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with the email that is in use', async () => {
    await service.signup('asdf@asdf.com', '1');
    await expect(service.signup('asdf@asdf.com', '1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an un used email', async () => {
    await expect(service.signin('asdf@asdf.com', '1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if password is not correct', async () => {
    await service.signup('asdf@asdf.com', 'passwordOld');
    await expect(
      service.signin('asdf@asdf.com', 'passwordNew'),
    ).rejects.toThrow();
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'mypassword');
    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
