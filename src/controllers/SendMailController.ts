import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import path from 'path';

import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {
    async execute(request: Request, response: Response) {
      const { email, survey_id } = request.body;

      const usersRepositoy = getCustomRepository(UsersRepository);
      const surveysRepository = getCustomRepository(SurveysRepository);
      const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

      const user = await usersRepositoy.findOne({ email });

      if(!user) {
        return response.status(400).json({
          error: "User does not exist"
        });
      }

      const survey = await surveysRepository.findOne({
        id: survey_id
      });

      if(!survey) {
        return response.status(400).json({
          error: "This survey does not exist"
        });
      };

      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        user_id: user.id,
        link: process.env.URL_MAIL
      }

      const npsPath = path.resolve(__dirname, "..", "views", "emails", "npsmail.hbs");

      const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
        where: [
          { user_id: user.id },
          { value: null }
        ],
        relations: ['user', 'survey']
      });

      if(surveyUserAlreadyExists) {
        await SendMailService.execute(email, survey.title, variables, npsPath);
        return response.json(surveyUserAlreadyExists);
      };

      const survey_user = surveysUsersRepository.create({
        user_id: user.id,
        survey_id
      })

      await surveysUsersRepository.save(survey_user);



      await SendMailService.execute(email, survey.title, variables, npsPath);

      return response.json(survey_user);

    }
}

export { SendMailController };

