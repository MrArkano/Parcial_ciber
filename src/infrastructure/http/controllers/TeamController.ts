import { Request, Response } from 'express';
import { SubmitFlag } from '../../../application/use-cases/SubmitFlag';
import { GetScoreboard } from '../../../application/use-cases/GetScoreboard';
import { PrismaTeamRepository } from '../../database/PrismaTeamRepository';
const repo = new PrismaTeamRepository();
const submitFlag = new SubmitFlag(repo);
const getScoreboard = new GetScoreboard(repo);
export class TeamController { static async submit(req: Request, res: Response): Promise<void> { try { const { team, flag } = req.body; const result = await submitFlag.execute(team, flag); res.json({ message: "FLAG ACCEPTED // \ \" }); } catch (e: any) { res.status(400).json({ error: e.message }); } }
 static async scoreboard(req: Request, res: Response): Promise<void> { try { const teams = await getScoreboard.execute(); res.json(teams); } catch (e: any) { res.status(500).json({ error: "Error interno" }); } } }
