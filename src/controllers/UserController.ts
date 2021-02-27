import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
          name: yup.string().required(),
          email: yup.string().email().required()
        });

        try {
          await schema.validate(request.body, { abortEarly: false });
        } catch (error) {
          return response.json({
            error
          })
        }

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

        return response.status(201).json(user);
    }
}

export { UserController };

