import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import { IUser } from "../models/user.model";

declare global{
    namespace Express{
        interface Request {
            user?:IUser;
        }
    }
}
let userRepository = new UserRepository();

export const authorizationMiddleware = async(req: Request, res: Response, next: NextFunction) =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new HttpError(401, "Unauthorized, header malformed");
        }
        const token = authHeader.split(" ")[1]; // "Beared <string>" [1] -> <string>
        if(!token){
            throw new HttpError(401, "Unauthorized, token missing");
        }
        const decodedtoken = jwt.verify(token, JWT_SECRET) as Record<string, any>; // verify with secret
        if(!decodedtoken || !decodedtoken.id){
            throw new HttpError(401, "Unauthorized, token invalid");
        }
        const user = await userRepository.getUserById(decodedtoken.id);
        if(!user){
            throw new HttpError(401, "Unauthorized, User not found");
        }
        //attach user to request object
        req.user = user;
        next();
    }
    catch (error: Error | any){
        return res.status(401).json({success:false, message:error.message || "Unauthorized"});
    }
}
