import * as mongoose from 'mongoose';
import UserRepository from '../../interfaces/repositories/UserRepository';

export let Schema = mongoose.Schema;
export let ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
}

const userSchema = new Schema({
  email: {
	   type: String,
	   required: true
  },
  password: {
	   type: String,
	   required: true
  },

  createdAt: {
	   type: Date,
	   required: false
  },
  modifiedAt: {
	   type: Date,
	   required: false
  }
// tslint:disable-next-line:typedef
}).pre< IUser>('save', function (next) {
  // tslint:disable-next-line: no-invalid-this
  if (this.isNew) {
    // tslint:disable-next-line: no-invalid-this
    this.createdAt = new Date();
  } else {
    // tslint:disable-next-line: no-invalid-this
    this.modifiedAt = new Date();
  }
  next();
});;
export let user = mongoose.model<IUser>('Users', userSchema);

export class UserModel {

  // tslint:disable-next-line:variable-name
  private readonly _userModel: IUser;

  // tslint:disable-next-line:variable-name
  constructor(_userModel: IUser) {
    this._userModel = _userModel;
  }
  get email(): string {
    return this._userModel.email;
  }

  get password(): string {
    return this._userModel.password;
  }


  // tslint:disable-next-line:function-name
   // tslint:disable-next-line: promise-function-async
  public  createUser(email: string, password: string) : Promise<IUser> {
    
    // tslint:disable-next-line:typedef
    // tslint:disable-next-line:no-unnecessary-local-variable
    // tslint:disable-next-line:typedef
    // tslint:disable-next-line: no-unnecessary-local-variable
    const p = new Promise<IUser>((resolve, reject) => {

      // tslint:disable-next-line: no-use-before-declare
      const repo = new UserRepository();

      // tslint:disable-next-line:no-shadowed-variable
      // tslint:disable-next-line:no-object-literal-type-assertion
      // tslint:disable-next-line:no-shadowed-variable
      // tslint:disable-next-line: no-object-literal-type-assertion
      const users = <IUser>{
          email: email,
          password: password
      };

      // tslint:disable-next-line:no-any
      repo.create(users, (err:any, res:any) => {
        if (err) {
          reject(err);
        }
        else {
          // tslint:disable-next-line: no-unsafe-any
          resolve(res);
        }
      });    
      
    });
    
    return p;
    
  }

  // tslint:disable-next-line: promise-function-async
  public  findUser(email: string) : Promise<IUser> {

    // tslint:disable-next-line:typedef
    // tslint:disable-next-line:no-unnecessary-local-variable
    const p = new Promise<IUser>((resolve, reject) => {
      const repo = new UserRepository();

      // tslint:disable-next-line: no-floating-promises
      // tslint:disable-next-line: no-unsafe-any
      // tslint:disable-next-line: no-void-expression
      // tslint:disable-next-line: no-unsafe-any
      repo.find({ email}).sort({ createdAt: -1 }).limit(1).exec((err: any, res: (IUser | PromiseLike<IUser>)[]) => {
        // tslint:disable-next-line: strict-boolean-expressions
        if (err) {
          reject(err);
        }
        else {
          // tslint:disable-next-line: strict-boolean-expressions
          if (res.length) {
            resolve(res[0]);
          }
          else {
            // tslint:disable-next-line: no-null-keyword
            resolve(null);
          }
        }
      });
    });
    
    return p;    
  }

}

Object.seal(UserModel);

export interface IRead<T> {
  // tslint:disable-next-line:no-any
  retrieve(callback: (error: any, result: any) => void): void;
    // tslint:disable-next-line:no-any
  findById(id: string, callback: (error: any, result: T) => void): void;
    // tslint:disable-next-line:no-any
  findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T>;
    // tslint:disable-next-line:no-any
  find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>;
}

export interface IWrite<T> {
    // tslint:disable-next-line:no-any
  create(item: T, callback: (error: any, result: any) => void): void;
    // tslint:disable-next-line:no-any
  // tslint:disable-next-line: variable-name
  update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void): void;
   // tslint:disable-next-line:no-any
  // tslint:disable-next-line: variable-name
  delete(_id: string, callback: (error: any, result: any) => void): void;
}

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

  // tslint:disable-next-line:variable-name
  private _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }
  public findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T> {
    throw new Error("Method not implemented.");
  }
  public find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]> {
    throw new Error("Method not implemented.");
  }

  // tslint:disable-next-line:typedef
  public create(item: T, callback: (error: any, result: T) => void) {
    // tslint:disable-next-line: no-floating-promises
    this._model.create(item, callback);
  }

  // tslint:disable-next-line:typedef
  public retrieve(callback: (error: any, result: T) => void) {
    this._model.find({}, callback);
  }

  // tslint:disable-next-line:typedef
  public update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this._model.update({ _id: _id }, item, callback);
  }

  // tslint:disable-next-line:typedef
  public delete(_id: string, callback: (error: any, result: any) => void) {
    this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
  }

  // tslint:disable-next-line:typedef
  public findById(_id: string, callback: (error: any, result: T) => void) {
    this._model.findById(_id, callback);
  }

}









