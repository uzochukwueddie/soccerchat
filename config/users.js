class Users {
  constructor(){
    this.users = [];
  }

  addUser(id, name, room){
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
    
  addUsername(id, sender, receiver){
      var user = {id, sender, receiver};
      this.users.push(user);
      return user;
  }

  removeUser(id){
    var user = this.getUser(id);

    if(user){
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser(id){
    var fetchUser = this.users.filter((userId) => {
      return userId.id === id;
    })[0];

    return fetchUser;
  }

  getUserList(room){
    var users = this.users.filter((user) => user.room === room);

    var namesArray = users.map((user) => {
      return user.name;
    });

    return namesArray;

    //The above is the same as
    // var users = this.users.filter((user) => {
    //   return user.room === room;
    // })
  }
}

module.exports = {Users}
