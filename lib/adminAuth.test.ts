// lib/adminAuth.test.ts

import { getUserFromRequest } from "@/auth/dependencies";
import { User } from "@/models/User";

describe("requireAdmin", () => {
  it("returns userId if user is an admin", async () => {
    const mockUser: User = {
      _id: "user123",
      username: "adminUser",
      email: "admin@example.com",
      isActive: true,
      isAdmin: true
    };

    jest.spyOn(getUserFromRequest, 'default').mockResolvedValue(mockUser);

    const userId = await requireAdmin({} as any);
    expect(userId).toBe("user123");
  });

  it("returns null if user is not an admin", async () => {
    const mockUser: User = {
      _id: "user456",
      username: "nonAdminUser",
      email: "nonadmin@example.com",
      isActive: true,
      isAdmin: false
    };

    jest.spyOn(getUserFromRequest, 'default').mockResolvedValue(mockUser);

    const userId = await requireAdmin({} as any);
    expect(userId).toBeNull();
  });

  it("returns null if no user is found", async () => {
    jest.spyOn(getUserFromRequest, 'default').mockResolvedValue(null);

    const userId = await requireAdmin({} as any);
    expect(userId).toBeNull();
  });
});