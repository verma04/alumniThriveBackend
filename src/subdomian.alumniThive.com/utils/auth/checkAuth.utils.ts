import moment from "moment";

import { decryptToken } from "../crypto/jwt.crypto";
import { GraphQLError } from "graphql";
const jwt = require("jsonwebtoken");

const checkAuth = async (context: any) => {
  if (!context.headers?.authorization) {
    throw new GraphQLError("Permission Denied", {
      extensions: {
        code: 403,
        http: { status: 403 },
      },
    });
  }

  const authHeader = await decryptToken(context.headers?.authorization);

  if (authHeader) {
    const token = authHeader?.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_TOKEN);

        return user;
      } catch (err) {
        console.log(err);
        throw new GraphQLError("Invalid/Expired token", {
          extensions: {
            code: 403,
            http: { status: 403 },
          },
        });
      }
    }
    throw new GraphQLError("Permission Denied", {
      extensions: {
        code: 403,
        http: { status: 403 },
      },
    });
  }
  throw new GraphQLError("Permission Denied", {
    extensions: {
      code: 403,
      http: { status: 403 },
    },
  });
};

export default checkAuth;
