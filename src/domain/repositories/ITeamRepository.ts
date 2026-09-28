import { Team } from '../entities/Team';
export interface ITeamRepository { findByName(name: string): Promise<Team | null>; save(team: Team): Promise<Team>; getTopTeams(): Promise<Team[]>; }
