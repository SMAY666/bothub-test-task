import {UserCreationAttributes, UserInstance} from '../model/types';
import {UserModel} from '../model';
import {UserRoles} from '../constants';


class UsersRepository {
    public async get(id: number): Promise<UserInstance> {
        const user = await UserModel.findById(id);
        if (!user) {
            throw Error('User not found');
        }

        return user;
    }

    public async create(data: UserCreationAttributes): Promise<UserInstance> {
        return await UserModel.create(data);
    }

    public async changeRole(id: number, role: UserRoles): Promise<UserInstance> {
        const user = await this.get(id);
        await user.update({role});

        return user;
    }
}

export const usersRepository = new UsersRepository();
