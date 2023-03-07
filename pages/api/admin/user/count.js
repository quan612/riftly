import { prisma } from "@context/PrismaContext";
import { adminMiddleware, withExceptionFilter } from "middlewares/";
import { ApiError } from 'next/dist/server/api-utils';

const adminUsersCountAPI = async (req, res) => {
  const { method } = req;

  if (method === "GET") {
    try {

      console.time()
      const userCount = await prisma.whiteList.count();
      console.timeEnd()

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=60, stale-while-revalidate');
      return res.status(200).json(userCount);
    } catch (error) {

      return res.status(200).json({ isError: true, message: error.message });
    }

  }
  throw new ApiError(400, `Method ${req.method} Not Allowed`)
};

export default (adminMiddleware(adminUsersCountAPI));

