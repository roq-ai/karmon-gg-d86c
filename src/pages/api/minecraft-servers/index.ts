import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { minecraftServerValidationSchema } from 'validationSchema/minecraft-servers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMinecraftServers();
    case 'POST':
      return createMinecraftServer();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMinecraftServers() {
    const data = await prisma.minecraft_server
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'minecraft_server'));
    return res.status(200).json(data);
  }

  async function createMinecraftServer() {
    await minecraftServerValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.minecraft_server.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
