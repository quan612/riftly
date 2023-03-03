import { getFirstDayCurMonth, getFirstDayPrevMonth, getLastDayCurMonth, getLastDayPrevMonth } from "@utils/index";
import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
import moment from "moment";


const adminUsersCountAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {

        let aggregatedUserStatistic = {}

        // get users count
        const usersCount = await prisma.whiteList.count();
        aggregatedUserStatistic.usersCount = usersCount;

        let whitelistData = await prisma.whiteListUserData.findMany();
        // console.log(whitelistData)

        //get users eth
        let usersETH = whitelistData.reduce((accumulator, row) => {
          let eth = parseFloat(row?.data?.eth) || 0.0;
          return parseFloat(accumulator) + eth
        }, 0.0)

        aggregatedUserStatistic.usersETH = usersETH.toFixed(2)

        // get news user
        // const { monday, sunday } = getFirstLastDayOfWeek()
        let firstDayPrevMonth = getFirstDayPrevMonth();
        let lastDayPrevMonth = getLastDayPrevMonth();
        let firstDayCurMonth = getFirstDayCurMonth();
        let lastDayCurMonth = getLastDayCurMonth();

        const newUsersLastMonth = await prisma.whiteList.count({
          where: {
            AND: [
              {
                createdAt: {
                  gte: firstDayPrevMonth
                }
              },
              {
                createdAt: {
                  lte: lastDayPrevMonth
                }
              },
            ]
          }
        })

        const newUsersThisMonth = await prisma.whiteList.count({
          where: {
            AND: [
              {
                createdAt: {
                  gte: firstDayCurMonth
                }
              },
              {
                createdAt: {
                  lte: lastDayCurMonth
                }
              },
            ]
          }
        })



        aggregatedUserStatistic.newUsers = {
          newUsersLastMonth,
          newUsersThisMonth,
          growth: (newUsersThisMonth - newUsersLastMonth) / newUsersThisMonth * 100
        }

        res.setHeader('Cache-Control', 'max-age=0, s-maxage=600, stale-while-revalidate');
        res.status(200).json(aggregatedUserStatistic);
      } catch (err) {
        console.log(err);
        res.status(200).json({ isError: true, message: err.message });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default adminMiddleware(adminUsersCountAPI);

const getFirstLastDayOfWeek = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = (today.getDate() - day + (day === 0 ? -6 : 1))

  let monday = new Date(today.setDate(diff))
  let sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)

  return { monday: new Date(monday.setHours(0, 0, 0, 0)), sunday: new Date(sunday.setHours(23, 59, 59, 59)) }
}



