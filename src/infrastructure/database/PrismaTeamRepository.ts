import { PrismaClient } from '@prisma/client';
import { ITeamRepository } from '../../domain/repositories/ITeamRepository';
import { Team } from '../../domain/entities/Team';
const prisma = new PrismaClient();
export class PrismaTeamRepository implements ITeamRepository { async findByName(name: string): Promise<Team | null> { const data = await prisma.team.findUnique({ where: { name } }); if (!data) return null; return new Team(data.id, data.name, data.score, data.solved, JSON.parse(data.completed)); }
 async save(team: Team): Promise<Team> { const data = await prisma.team.upsert({ where: { name: team.name }, update: { score: team.score, solved: team.solved, completed: JSON.stringify(team.completed) }, create: { name: team.name, score: team.score, solved: team.solved, completed: JSON.stringify(team.completed) } }); return new Team(data.id, data.name, data.score, data.solved, JSON.parse(data.completed)); }
 async getTopTeams(): Promise<Team[]> { const data = await prisma.team.findMany({ orderBy: { score: 'desc' } }); return data.map(d => new Team(d.id, d.name, d.score, d.solved, JSON.parse(d.completed))); } }
