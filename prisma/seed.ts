"use server";
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const admin = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  name: process.env.ADMIN_NAME,
};

async function main() {
  try {
    if (!admin.email || !admin.password || !admin.name) {
      throw new Error(
        "Please provide ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME in .env file"
      );
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(admin.password, salt);

    if (admin.email !== "nikolozkopadze@gmail.com") {
      throw new Error("Please provide correct email");
    }

    await prisma.user.upsert({
      where: {
        email: admin.email,
      },
      create: {
        email: admin.email,
        passwordHash: hashPassword,
        role: "ADMIN",
        name: admin.name,
      },
      update: {},
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  });
