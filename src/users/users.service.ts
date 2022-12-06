import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Pagination } from 'src/types/types'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './entities/user.entity'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private readonly User: typeof UserModel,
  ) {}

  async create(CreateUserDto: CreateUserDto) {
    const user = new this.User()
    Object.assign(user, CreateUserDto)
    await user.save()
    return await user.reload()
  }

  async findAll(query: Pagination) {
    const offset = (query.page - 1) * query.perPage
    const users = await this.User.findAll({ offset, limit: query.perPage })
    return users
  }

  async countAll() {
    const total = await this.User.count()
    return total
  }
  async search(term: string) {
    return await this.User.findAll({
      where: {
        name: {
          [Op.like]: `%${term}%`,
        },
      },
      limit: 20,
    })
  }

  async findOne(where: any, showPassword: boolean = false) {
    const users = await this.User.findOne({
        attributes: { exclude: showPassword ? ['createdAt', 'updatedAt'] : ['password', 'createdAt', 'updatedAt'] }, 
        where: where
      })
    return users
  }

  async update(
    User: UserModel,
    UpdateUserDto: UpdateUserDto
  ) {
    Object.assign(User, UpdateUserDto)
    await User.save()
    return await User.reload()
  }

  async remove(existingUser: UserModel) {
    return await existingUser.destroy()
  }

  async authenticateUser(email: string, password: string) {
    const user = await this.User.findOne({ where: { email: email } })
    
    if(user) {
      let result = await bcrypt.compare(password, user.password);
      return result;
    } 
    return user;
  }
}
