import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class NPSController {
  async execute(request: Request, response: Response) {

    const { survey_id } = request.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id, value: Not(IsNull())
    });

    const detractors = surveysUsers.filter(survey => survey.value < 7).length;
    const promoters = surveysUsers.filter(survey => survey.value > 8).length;
    const passive = surveysUsers.filter(survey => survey.value >=7 && survey.value <= 8).length;
    const totalAnswers = surveysUsers.length;

    const NPS = Number((((promoters - detractors) / totalAnswers ) * 100).toFixed(2));

    return response.json({
      detractors,
      promoters,
      passive,
      totalAnswers,
      NPS
    })
  }
}

export { NPSController }
