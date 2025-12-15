class UserDTO {
    constructor(user) {
        this.id = user._id || user.id;
        this.full_name = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.age = user.age;
        this.role = user.rol;
        this.cart = user.cart;
        this.last_connection = user.last_connection;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;

    }
}

export default UserDTO;