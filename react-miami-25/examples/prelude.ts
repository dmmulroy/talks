export const Auth = {
	check: async (_: {
		action: string;
		resource: string;
		resourceId: string;
		userId: string;
	}) => {
		//
	},
} as const;

export const Billing = {
	charge: async (userId: string, opts: { amount: number; sku: string }) => {
		return Promise.resolve();
	},
} as const;

export const Db = {
	update: async <A>(collection: string, item: A) => {
		return Promise.resolve({} as Domain);
	},
} as const;

export const Registrar = {
	getPrice: (domainName: string, opts: { type: string; years: number }) => {
		return Promise.resolve(0 as number);
	},
	renew: (
		domainName: string,
		opts: { expectedPrice: number; years: number },
	) => {
		return Promise.resolve({} as Domain);
	},
};

export type Domain = Readonly<{
	/** The top level domain (e.g. .com, .ai, .dev) */
	tld: string;
	/** The second level domain (e.g. 'example' for example.com) */
	sld: string;
	/** The full domain name (e.g. example.com) */
	name: string;
	/** The date that the domain expires */
	expirationDate: Date;
}>;
