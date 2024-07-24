import {UserCreationAttributes, UserInstance} from '../model/types';
import {UserModel} from '../model';
import {UserRoles} from '../constants';
import {createHash} from '../../authorization/password';
import {GetOptions} from './types';


class UsersRepository {
    public async getById(id: number): Promise<UserInstance> {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    public async get(options?: GetOptions): Promise<UserInstance> {
        const user = await UserModel.findOne({
            where: {
                 ...(options ? options : {}),
            }
        });
        if (!user) {
            throw new Error('User not found');
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
        const user = await this.getById(id);
        await user.update({role});

        return user;
    }
}

export const usersRepository = new UsersRepository();
