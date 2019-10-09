import { IUserRepository } from "../../application/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import * as UserModel from '../../domain/entities/UserModel';


const user = new User({
  id: "chinh@willbe.vn",
  email: "chinh@willbe.vn",
  password: "iloveyouman"
})
// interface getAllUser{
//   async (email:string):User
// }

export default class UserRepository implements IUserRepository {
  public async loadByEmailAndPassword(email: string, password: string): Promise<User> {
   
    //const users = await UserModel.find({});

    //console.log(users);
    // tslint:disable-next-line: possible-timing-attack 
    if (email === user.email && password === user.password) {
      return user
    }
    return undefined
  }

  public async loadById(id: string): Promise<User> {
    if (id === user.id) {
      return user
    }
    return undefined
  }
}