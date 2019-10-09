// tslint:disable: variable-name

export class User {
  public id: string
  public email: string
  public password: string
  // tslint:disable-next-line: no-any
  constructor(json: any) {
    console.log('json-----------------',json);
    Object.assign(this, json)
  }
  
}


