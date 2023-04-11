import { Request, Response, NextFunction, Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const JWT_SEC: string | undefined = process.env.JWT_SEC;
if (!JWT_SEC) {
    throw new Error("Missing JWT_SEC environment variable");
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    // const authHeader: string | string[] |undefined = req.headers["token"]; // test for errors
    // const authHeader: string = req.headers.token;
    const authHeader: string = req.headers.token as string;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        // const token = Array.isArray(authHeader)
        //     ? authHeader[0].split(" ")[1]
        //     : authHeader.split(" ")[1];

        jwt.verify(token, JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token not valid, or doesn't exist");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: "You are not authenticated!" });
    }
};

// ---------------------------
// ---------------------------
// ---------------------------
//   refactor for typescript
// ---------------------------
// ---------------------------
// ---------------------------
// CHECKS IF ADMIN OR USER
const verifyTokenAndAuthorization = (req: any, res: any, next: any) => {
    // calls method above
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
// ---------------------------
// ---------------------------
// ---------------------------
//   refactor for typescript
// ---------------------------
// ---------------------------
// ---------------------------
// CHECKS IF ADMIN
const verifyTokenAndAdmin = (req: any, res: any, next: any) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
