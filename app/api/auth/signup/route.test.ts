// app/api/auth/signup/route.test.ts

import { request } from 'supertest';
import { app } from '../../app'; // Adjust the path based on your project structure
import * as resend from 'resend';

jest.mock('resend', () => ({
  sendEmail: jest.fn(),
}));

describe('POST /api/auth/signup', () => {
  it('should call sendEmail after successful user creation', async () => {
    const mockUser = {
      _id: '12345',
      username: 'testuser',
      email: 'test@example.com',
      isActive: true,
    };

    // Mock the user creation logic to return the mock user
    const createUserMock = jest.fn().mockResolvedValue(mockUser);

    // Replace the actual user creation function with the mock
    app.locals.createUser = createUserMock;

    // Send a POST request to the signup route
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    // Verify that sendEmail was called with the correct arguments
    expect(resend.sendEmail).toHaveBeenCalledWith({
      to: mockUser.email,
      from: '"DailyLog" <welcome@dailylog.io>',
      subject: 'Welcome to DailyLog',
      html: `<p>Hi ${mockUser.username}, welcome to DailyLog!</p>`,
    });
  });

  it('should handle errors during user creation', async () => {
    const createUserMock = jest.fn().mockRejectedValue(new Error('User creation failed'));

    app.locals.createUser = createUserMock;

    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(500);

    expect(resend.sendEmail).not.toHaveBeenCalled();
  });
});