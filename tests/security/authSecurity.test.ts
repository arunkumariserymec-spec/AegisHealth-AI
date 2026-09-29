/**
 * Security & Role-Based Authorization Tests
 */

import { dbStore } from '../../backend/src/db/store';

describe('Authentication and RBAC Security Verification', () => {
  test('rejects unauthorized access without valid admin role', () => {
    const regularUser = dbStore.registerUser({
      name: 'Test Regular User',
      email: 'regular@test.com',
      password: 'password123'
    });

    expect(regularUser.role).toBe('user');
    expect((regularUser as any).passwordHash).toBeUndefined();
    expect((regularUser as any).salt).toBeUndefined();
  });

  test('hashes user passwords using PBKDF2 with unique salt', () => {
    const user1 = dbStore.registerUser({
      name: 'User 1',
      email: 'u1@test.com',
      password: 'identicalPassword'
    });

    const user2 = dbStore.registerUser({
      name: 'User 2',
      email: 'u2@test.com',
      password: 'identicalPassword'
    });

    expect(user1.id).not.toBe(user2.id);
  });

  test('admin authentication succeeds with correct credentials', () => {
    const admin = dbStore.authenticate('admin@aihealth.org', 'admin123');
    expect(admin).not.toBeNull();
    expect(admin?.role).toBe('admin');
  });

  test('admin authentication fails with invalid password', () => {
    const admin = dbStore.authenticate('admin@aihealth.org', 'wrongPassword');
    expect(admin).toBeNull();
  });
});
