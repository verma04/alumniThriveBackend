"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_crypto_1 = require("../crypto/jwt.crypto");
const graphql_1 = require("graphql");
const jwt = require('jsonwebtoken');
const checkAuth = async (context) => {
    if (!context.headers?.authorization) {
        throw new graphql_1.GraphQLError('Permission Denied', {
            extensions: {
                code: 403,
                http: { status: 403 },
            },
        });
    }
    const authHeader = await (0, jwt_crypto_1.decryptToken)(context.headers?.authorization);
    if (authHeader) {
        const token = authHeader?.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, process.env.JWT_TOKEN);
                return user;
            }
            catch (err) {
                console.log(err);
                throw new graphql_1.GraphQLError('Invalid/Expired token', {
                    extensions: {
                        code: 403,
                        http: { status: 403 },
                    },
                });
            }
        }
        throw new graphql_1.GraphQLError('Permission Denied', {
            extensions: {
                code: 403,
                http: { status: 403 },
            },
        });
    }
    throw new graphql_1.GraphQLError('Permission Denied', {
        extensions: {
            code: 403,
            http: { status: 403 },
        },
    });
};
exports.default = checkAuth;
