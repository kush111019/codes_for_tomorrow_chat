import jwt from "jsonwebtoken" ;

const secret: any  = process.env.JWT_SECRET ;

export function signToken(payload: object): string {
    return jwt.sign(payload,secret,{expiresIn: "1d"}) ;
}

export function verifyToken(token: string){
    return jwt.verify(token,secret)


}