import { ITeamRepository } from '../../domain/repositories/ITeamRepository';
export class GetScoreboard { constructor(private teamRepo: ITeamRepository) {}
 async execute() { return await this.teamRepo.getTopTeams(); } }
