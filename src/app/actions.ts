"use server";
import { VerificationCodeTemplate } from "@/components/verification-code-template";
import { getUserSession } from "@/lib/get-user-session";
import { sendEmail } from "@/lib/send-email";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";

export async function registerProfile(data: Prisma.UserCreateInput) {
  try {
    const findUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (findUser) {
      if (!findUser.verified) {
        return { error: "The user already exists" };
      }
      return { error: "The user already exists" };
    }

    const createUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashSync(data.password as string, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createUser.id,
      },
    });

    await sendEmail(
      data.email,
      "Shopix Pizza verification code",
      VerificationCodeTemplate({ code }),
    );
    return { error: null, success: true };
  } catch (error) {
    console.log(error);
  }
}

export async function updateProfile(data: Prisma.UserUpdateInput) {
  try {
    const user = await getUserSession();
    if (!user?.email) {
      throw new Error("The user's email is not found");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!findUser) {
      throw new Error("The user's email is not found");
    }

    if (findUser.email === data.email) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: data.name,
          email: data.email,
          password: data.password
            ? hashSync(data.password as string, 10)
            : findUser.password,
        },
      });
    } else {
      if (data.email) {
        let isVerify = false;
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: data.name,
            email: data.email,
            password: data.password
              ? hashSync(data.password as string, 10)
              : findUser.password,
            verified: undefined,
          },
        });

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.verificationCode.create({
          data: {
            code,
            userId: findUser.id,
          },
        });
        await sendEmail(
          data.email as string,
          "Shopix Pizza verification code",
          VerificationCodeTemplate({ code }),
        );
        isVerify = true;
        return isVerify;
      }
    }
  } catch (error) {
    console.log("PROFILE UPDATE ERROR", error);
  }
}
