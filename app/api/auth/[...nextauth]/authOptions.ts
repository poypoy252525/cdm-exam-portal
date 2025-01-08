import prisma from "@/prisma/db";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        studentId: {},
      },
      authorize: async (credentials) => {
        const student = await prisma.student.findFirst({
          where: {
            email: credentials?.email,
            studentId: credentials?.studentId,
          },
        });

        if (student) {
          return {
            id: student.id,
            email: student.email,
            name: student.fullName,
            studentId: student.studentId,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};
