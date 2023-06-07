import * as jwt from 'jsonwebtoken'

export class JwtService{
    private accessKey: string = "SecretAccessKey"

    

    public async verifyAccess(token){
        return jwt.verify(token, this.accessKey)
    }
}