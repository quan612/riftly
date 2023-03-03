import Enums, { WALLET, TWITTER, DISCORD, EMAIL, GOOGLE } from "@enums/index";
import { getFirstDayCurMonth, getFirstDayOfLastYear, getFirstDayOfYear, getFirstDayPrevMonth, getLastDayCurMonth, getLastDayOfLastYear, getLastDayPrevMonth, getTomorrow } from "@utils/index";
import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
import moment from "moment";


const adminUsersSignUpStatisticAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {

        const { filterBy } = req.body;


        let min, max, truncBy = 'day', seriesBy = '1 day';
        switch (filterBy) {
          case Enums.THIS_MONTH:
            min = new Date(getFirstDayCurMonth().setHours(0, 0, 0, 0))
            max = getTomorrow()
            break;
          case Enums.LAST_MONTH:
            min = new Date(getFirstDayPrevMonth().setHours(0, 0, 0, 0))
            max = new Date(getLastDayPrevMonth().setHours(23, 59, 59, 59))
            break;
          case Enums.THIS_YEAR:
            truncBy = 'month';
            seriesBy = '1 month'
            min = getFirstDayOfYear();
            max = getTomorrow();
            break;
          case Enums.LAST_YEAR:
            truncBy = 'month'
            seriesBy = '1 month'
            min = getFirstDayOfLastYear();
            max = getLastDayOfLastYear();
            break;
          default:
            throw new Error("Invalid user sign up filter type")
        }

        console.log("min", min)
        console.log("max", max)


        const usersSignUp = await prisma.$queryRaw`
with dateRanges as (SELECT date_trunc('day', dd)::date as dates --to get only date part
    FROM generate_series
         ( ${min}::timestamp 
         , ${max}::timestamp
         , ${seriesBy}::interval) dd), --month / day for series of date ranges
countByTwitter as
(
 select count(w."id"), w."signUpOrigin", DATE_TRUNC(${truncBy}, w."createdAt")::date as summaryDate from public."WhiteList" w
        where w."createdAt" >= ${min} and w."createdAt" <= ${max} and w."signUpOrigin" = ${TWITTER}
        group by summaryDate, w."signUpOrigin"
),
countByWallet as
(
 select count(w."id"), w."signUpOrigin", DATE_TRUNC(${truncBy}, w."createdAt")::date as summaryDate from public."WhiteList" w
        where w."createdAt" >= ${min} and w."createdAt" <= ${max} and w."signUpOrigin" = ${WALLET}
        group by summaryDate, w."signUpOrigin"
),
countByDiscord as
(
 select count(w."id"), w."signUpOrigin", DATE_TRUNC(${truncBy}, w."createdAt")::date as summaryDate from public."WhiteList" w
        where w."createdAt" >= ${min} and w."createdAt" <= ${max} and w."signUpOrigin" = ${DISCORD}
        group by summaryDate, w."signUpOrigin"
),
countByEmail as
(
 select count(w."id"), w."signUpOrigin", DATE_TRUNC(${truncBy}, w."createdAt")::date as summaryDate from public."WhiteList" w
        where w."createdAt" >= ${min} and w."createdAt" <= ${max} and w."signUpOrigin" = ${EMAIL}
        group by summaryDate, w."signUpOrigin"
),
countByGoogle as
(
 select count(w."id"), w."signUpOrigin", DATE_TRUNC(${truncBy}, w."createdAt")::date as summaryDate from public."WhiteList" w
        where w."createdAt" >= ${min} and w."createdAt" <= ${max} and w."signUpOrigin" = ${GOOGLE}
        group by summaryDate, w."signUpOrigin"
)

select s.dates::date, coalesce(a."count", 0) as count, coalesce(a."signUpOrigin", ${TWITTER}) as "signUpOrigin"
  from dateRanges s left join countByTwitter a on s.dates = a.summarydate
union
select s.dates, coalesce(a."count", 0) as count, coalesce(a."signUpOrigin", ${WALLET}) as "signUpOrigin"
  from dateRanges s left join countByWallet a on s.dates = a.summarydate 
union
select s.dates::date, coalesce(a."count", 0) as count, coalesce(a."signUpOrigin", ${DISCORD}) as "signUpOrigin"
  from dateRanges s left join countByDiscord a on s.dates = a.summarydate 
union
select s.dates, coalesce(a."count", 0) as count, coalesce(a."signUpOrigin", ${EMAIL}) as "signUpOrigin"
  from dateRanges s left join countByEmail a on s.dates = a.summarydate 
union
select s.dates, coalesce(a."count", 0) as count, coalesce(a."signUpOrigin", ${GOOGLE}) as "signUpOrigin"
  from dateRanges s left join countByGoogle a on s.dates = a.summarydate 
order by "signUpOrigin", dates
        `

        usersSignUp.forEach((r) => {
          r.count = r.count.toString();
          return r
        })

        //translation

        res.setHeader('Cache-Control', 'max-age=0, s-maxage=600, stale-while-revalidate');
        res.status(200).json(usersSignUp);
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

export default adminMiddleware(adminUsersSignUpStatisticAPI);

const getFirstLastDayOfWeek = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = (today.getDate() - day + (day === 0 ? -6 : 1))

  let monday = new Date(today.setDate(diff))
  let sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)

  return { monday: new Date(monday.setHours(0, 0, 0, 0)), sunday: new Date(sunday.setHours(23, 59, 59, 59)) }
}



