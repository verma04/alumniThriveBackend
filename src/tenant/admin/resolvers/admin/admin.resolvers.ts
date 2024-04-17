import { db } from "../../../../../@drizzle";
import {
  loginSession,
  profileInfo,
  users,
} from "../../../../../@drizzle/src/db/schema";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { Query } from "mongoose";
import sendOtp from "../../utils/sendOtp.utils";
import { decryptOtp, encryptOtp } from "../../utils/crypto/otp.crypto";
import generateJwtToken from "../../utils/generateJwtToken.utils";
import { checkEmail } from "../../utils/mail/checkmail.utils";
import checkAuth from "../../utils/auth/checkAuth.utils";
import { and, eq } from "drizzle-orm";
const adminResolvers = {
  Query: {
    async getUser(_: any, {}: any, context: any) {
      try {
        const data = await checkAuth(context);
        const token = context.headers?.authorization;

        const check = await db.query.loginSession.findFirst({
          where: (session, { eq }) =>
            and(eq(session.token, token), eq(session.logout, false)),
        });

        if (!check) {
          return new GraphQLError("Session Expired", {
            extensions: {
              code: 403,
              http: { status: 403 },
            },
          });
        } else {
          return {
            status: true,
            id: data.id,
          };
        }
      } catch (error) {
        throw error;
      }
    },

    async userProfile(_: any, {}: any, context: any) {
      try {
        const data = await checkAuth(context);

        const user = await db.query.users.findFirst({
          where: (session, { eq }) => eq(session.id, data.id),
        });
        return user;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    async logoutUser(_: any, {}: any, context: any) {
      try {
        const data = await checkAuth(context);
        const token = context.headers?.authorization;
        await db
          .update(loginSession)
          .set({ logout: true })
          .where(eq(loginSession.token, token));

        return {
          success: true,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async logoutUserAllDevices(_: any, {}: any, context: any) {
      try {
        const data = await checkAuth(context);
        await db
          .update(loginSession)
          .set({ logout: true })
          .where(eq(loginSession.userId, data.id));

        return {
          success: true,
        };
      } catch (error) {
        throw error;
      }
    },
    async registerAsAdmin(_: any, { input }: any, context: any) {
      try {
        const { password, firstName, lastName, email } = input;

        const checkMail = await checkEmail(email);

        if (checkMail) {
          return new GraphQLError(
            "Kindly provide your official email address",
            {
              extensions: {
                code: "NOT FOUND",
                http: { status: 400 },
              },
            }
          );
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const data = await db
          .insert(users)

          .values({ password: hashPassword, firstName, lastName, email })
          .returning();

        return {
          success: true,
        };
      } catch (error) {
        if (error.code === "23505") {
          throw new GraphQLError(
            "An email with this address already exists. Please try another one",
            {
              extensions: {
                code: 400,
                http: { status: 400 },
              },
            }
          );
        } else {
          throw new GraphQLError("Something went wrong", {
            extensions: {
              code: 400,
              http: { status: 400 },
            },
          });
        }
      }
    },

    async loginAsAdmin(_: any, { input }: any, context: any) {
      try {
        const { email, password } = input;

        const check = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, email),
        });

        if (!check) {
          return new GraphQLError("Email Not Found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 400 },
            },
          });
        } else {
          const comparePassword = await bcrypt.compare(
            password,
            check?.password
          );

          if (!comparePassword) {
            return new GraphQLError("Wrong credentials", {
              extensions: {
                code: "NOT FOUND",
                http: { status: 400 },
              },
            });
          }

          return sendOtp(check);
        }
      } catch (error) {
        console.log(error);
        // if (error.code === "23505") {
        //   console.log(error.code);
        //   throw new GraphQLError("Email Already exists", {
        //     extensions: {
        //       code: "NOT FOUND",
        //       http: { status: 400 },
        //     },
        //   });
        // } else {
        //   throw new GraphQLError("Something went wrong", {
        //     extensions: {
        //       code: "SOMETHING WENT WRONG",
        //       http: { status: 400 },
        //     },
        //   });
        // }
      }
    },

    async otpLogin(_: any, { input }: any, context: any) {
      try {
        const { otp, id } = input;
        const check = await db.query.otp.findFirst({
          where: (otp, { eq }) => eq(otp.id, id),
        });

        if (!check) {
          return new GraphQLError("Otp Expired", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 400 },
            },
          });
        } else {
          const decryptedOtp = await decryptOtp(check.otp);
          if (decryptedOtp !== otp) {
            return new GraphQLError("Invalid Otp", {
              extensions: {
                code: "NOT FOUND",
                http: { status: 400 },
              },
            });
          }

          const jwt = await generateJwtToken(check);
          const createLoginSession = await db
            .insert(loginSession)
            .values({ userId: check.userId, token: jwt })
            .returning();
          console.log(createLoginSession);
          return createLoginSession[0];
        }
      } catch (error) {
        console.log(error);
        if (error.code === "22P02") {
          console.log(error.code);
          throw new GraphQLError("Otp Expired", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 400 },
            },
          });
        } else {
          throw new GraphQLError("Something went wrong", {
            extensions: {
              code: "SOMETHING WENT WRONG",
              http: { status: 400 },
            },
          });
        }
      }
    },
  },
};

export { adminResolvers };
