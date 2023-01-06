function getHeaders(nameOrHeaders) {
    nameOrHeaders = nameOrHeaders ?? 'RateLimit'
    return !nameOrHeaders || typeof nameOrHeaders === 'string'
        ? ([
            `X-${nameOrHeaders}-Limit`,
            `X-${nameOrHeaders}-Remaining`,
            `X-${nameOrHeaders}-Reset`,
        ])
        : nameOrHeaders
}

const rateLimited = ({ id, response }) => {
    return new Response(
        JSON.stringify({
            error: { message: `API rate limit exceeded for ${id}` },
        }),
        {
            status: 429,
            headers: {
                ...Object.fromEntries(response.headers),
                'Content-Type': 'application/json',
            },
        }
    )
}

async function rateLimit(context) {
    let { headers, id, limit, timeframe, count, onRateLimit, response } = context

    // By removing the milliseconds our of the date and dividing by `timeframe`
    // we now have a time that changes every `timeframe` seconds
    const time = Math.floor(Date.now() / 1000 / timeframe)
    const key = `${id}:${time}`
    let countOrRes

    try {
        countOrRes = await count({ ...context, key })
    } catch (err) {
        console.error('Rate limit `count` failed with:', err)
        // If the count function fails we'll ignore rate limiting and
        // return a successful response to avoid blocking the request
        return response || new Response(null)
    }

    const h = countOrRes instanceof Response ? countOrRes.headers : new Headers()
    const remaining = countOrRes instanceof Response ? 0 : limit - countOrRes
    const reset = (time + 1) * timeframe

    if (headers[0]) h.set(headers[0], `${limit}`)
    if (headers[1]) h.set(headers[1], `${remaining < 0 ? 0 : remaining}`)
    if (headers[2]) h.set(headers[2], `${reset}`)
    if (countOrRes instanceof Response) return countOrRes
    if (remaining < 0) {
        const res = await onRateLimit(context)

        // Concat the rate limiting headers
        headers.forEach((key) => {
            if (key) res.headers.set(key, h?.get(key))
        })

        return res
    }

    // Add the headers to the response in context
    for (const [key, value] of h) {
        response.headers.set(key, value)
    }

    return response
}

export const initRateLimit = (fn) =>
    async function isRateLimited(request, response) {
        const ctx = await fn(request, response)

        if (ctx instanceof Response) return ctx

        return rateLimit({
            ...ctx,
            request: ctx.request ?? request,
            response: ctx.response ?? response ?? new Response(null),
            headers: getHeaders(ctx.headers),
            onRateLimit: ctx.onRateLimit ?? rateLimited,
        })
    }