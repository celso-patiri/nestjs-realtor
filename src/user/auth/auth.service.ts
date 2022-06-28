import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignInParams {
  email: string;
  password: string;
}

interface SignUpParams extends SignInParams {
  name: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUp(
    { email, name, password, phone }: SignUpParams,
    userType: UserType,
  ) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) throw new ConflictException();

    const hashedPassowrd = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassowrd,
        user_type: userType,
      },
    });

    return this.generateJwt(name, user.id);
  }

  async signIn({ email, password }: SignInParams) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) throw new HttpException('Invalid Credentials', 400);

    const isValidPassowrd = await bcrypt.compare(password, user.password);

    if (!isValidPassowrd) throw new HttpException('Invalid Credentials', 400);

    return this.generateJwt(user.name, user.id);
  }

  private generateJwt(name: String, id: number) {
    return jwt.sign({ name, id: id }, process.env.JWT_SECRET, {
      expiresIn: 3600000,
    });
  }

  generatePrivateKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
