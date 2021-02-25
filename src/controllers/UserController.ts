import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyRegistered = await usersRepository.findOne({
          email
        });

        if(userAlreadyRegistered) {
          return response.status(400).json({
            error: "There is already an user registered with this e-mail address"
          })
        }

        const user = usersRepository.create({
          name, email
        });

        await usersRepository.save(user);

        return response.json(user);
    }
}

export { UserController };
