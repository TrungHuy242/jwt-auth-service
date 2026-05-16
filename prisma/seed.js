require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@gmail.com";
  const userEmail = "user@example.com";
  const password = "123456";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        status: "ACTIVE",
      },
    });
    console.log("Created admin user: admin@gmail.com / 123456");
  } else {
    console.log("Admin user already exists");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: "Test User",
        email: userEmail,
        password: hashedPassword,
        role: "USER",
        isVerified: true,
        status: "ACTIVE",
      },
    });
    console.log("Created user: user@example.com / Password123!");
  } else {
    console.log("User already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
