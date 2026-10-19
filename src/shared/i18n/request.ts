import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

const locales = ['ru', 'en', 'ky'] as const
const defaultLocale = 'ru'

export default getRequestConfig(async () => {
	const cookieStore = await cookies()
	const cookieLocale = cookieStore.get('locale')?.value
	const locale = locales.includes(cookieLocale as (typeof locales)[number])
		? cookieLocale!
		: defaultLocale

	return {
		locale,
		messages: (await import(`./locales/${locale}.json`)).default,
	}
})
