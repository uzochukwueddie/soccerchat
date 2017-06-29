class Users {
  constructor(){
    this.users = [];
    this.receivers = [];
    this.globalRoom = [];
  }

  addUser(id, name, room){
    var user = {id, name, room};
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
  }

//...........................................................................................................................
  enterRoom(id, name, room, img){
      var roomName = {id, name, room, img};
      this.globalRoom.push(roomName);
      return roomName;
  }

  
  removeRoom(name){
    var name = this.globalRoom.filter((user) => user.name === name);

    var names = name.map((name) => {
      return name.name;
    });

    var arr = names.filter(function(value){
      return value !== name
    })

    return arr
  }

  getList(name){
    var userWithId = this.globalRoom.filter((userId) => {
      return userId.name === name;
    })[0];

    return userWithId;
  }


  getRoomList(room){
    var roomName = this.globalRoom.filter((user) => user.room === room);

    var names = roomName.map((name) => {
//        return name.name;
        return {
            name: name.name,
            img: name.img
        }
    });

    return names;
  }

}

module.exports = {Users}
