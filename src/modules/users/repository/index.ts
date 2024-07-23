import {UserCreationAttributes, UserInstance} from '../model/types';
import {UserModel} from '../model';
import {UserRoles} from '../constants';
import {createHash} from '../../authorization/password';


class UsersRepository {
    public async get(id: number): Promise<UserInstance> {
        const user = await UserModel.findById(id);
        if (!user) {
            throw Error('User not found');
        }

        return user;
    }

    public async register(data: UserCreationAttributes, password: string,  confirmPassword: string): Promise<UserInstance> {
        const userExist = await UserModel.findOne({
            where: [
                {email: data.email},
                {username: data.username}
            ]
        });
        if (userExist) {
            throw new Error('User already exist');
        }
        if (password !== confirmPassword) {
            throw new Error('Password is not confirmed');
        }

        return await UserModel.create({
            ...data,
            passwordHash: createHash(password),
        });
    }

    public async changeRole(id: number, role: UserRoles): Promise<UserInstance> {
        const user = await this.get(id);
        await user.update({role});

        return user;
    }
}

export const usersRepository = new UsersRepository();
