import { Model } from 'mongoose';
import { User } from './entities/users.entity';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  LoginDTO,
  ObjectId,
  RegisterDTO,
  RegisterResponse,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    public userModel: Model<User>,
  ) {}

  /**
   * Create new user
   * @param registerDTO
   */
  async createUser(registerDTO: RegisterDTO): Promise<RegisterResponse> {
    let user = await this.getUserByEmail(registerDTO.email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    const password = await bcrypt.hash(registerDTO.password, 10);

    user = new this.userModel({
      name: registerDTO.name,
      email: registerDTO.email,
      password: password,
    });

    try {
      user = await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!user) {
      throw new ConflictException('User not created');
    }

    return {
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      role: user.role,
      _id: user._id,
    };
  }

  /**
   * Find all users [@todo]
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Find user by username
   * @param loginDTO
   */
  async findByPayload(loginDTO: LoginDTO) {
    const { email } = loginDTO;
    return this.userModel.findOne({ email });
  }

  /**
   * Find account by user and password
   * @param loginDTO
   */
  async findByLogin(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
    const user = await this.userModel.findOne({ email });
    Logger.log(password);
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Get user by ObjectId
   * @param id
   */
  async getUserById(id: ObjectId) {
    let user;
    try {
      user = await this.userModel.findById({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get user by username/email [ duplicate ]
   * @param email
   */
  async getUserByEmail(email: string) {
    let user;
    try {
      user = await this.userModel.findOne({ email }, 'email name role').exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return user;
  }
}
