interface User {
  login: string;
  password: string;
}

class Users {
  private static instance: Users | undefined;

  private users: Array<User> = [];

  static getInstance() {
    if (Users.instance) return Users.instance;
    Users.instance = new Users();
    return Users.instance;
  }

  private constructor() {}

  addUser(data: User) {
    this.users.push(data);
  }

  checkForUser(data: User): User {
    return this.users.find(
      (user) => user.login === data.login && user.password === data.password
    );
  }
}

export default Users;
