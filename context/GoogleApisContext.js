const { BetaAnalyticsDataClient } = require('@google-analytics/data');
import { prisma } from "context/PrismaContext";

export const analyticsDataClient = async () => {
    let variables = await prisma.questVariables.findFirst()
    const { googleClientEmail, googleClientId, googleProjectId } = variables;

    if (googleClientEmail.trim().length < 1 || googleClientId.trim().length < 1 || googleProjectId.trim().length < 1 || process.env.GOOGLE_ANALYTICS_PRIVATE_KEY.trim().length < 1) {
        throw new Error("Missing google analytics configuration.")
    }

    return new BetaAnalyticsDataClient({
        credentials: {
            client_email: googleClientEmail,
            client_id: googleClientId,
            private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY
        },
        projectId: googleProjectId
    })
}

if (process.env.NODE_ENV !== 'production') global.analyticsDataClient = analyticsDataClient
