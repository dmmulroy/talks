const Auth = {
	check: async (_: {
		action: string;
		resource: string;
		resourceId: string;
		userId: string;
	}) => {
		//
	},
} as const;

const Billing = {
	charge: async (userId: string, opts: { amount: number; sku: string }) => {
		return Promise.resolve();
	},
} as const;

const Db = {
	update: async <A>(collection: string, item: A) => {
		return Promise.resolve({} as Domain);
	},
} as const;

const Registrar = {
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

type Domain = Readonly<{
	/** The top level domain (e.g. .com, .ai, .dev) */
	tld: string;
	/** The second level domain (e.g. 'example' for example.com) */
	sld: string;
	/** The full domain name (e.g. example.com) */
	name: string;
	/** The date that the domain expires */
	expirationDate: Date;
}>;

type RenewDomainOptions = Readonly<{
	userId: string;
	years: number;
}>;

async function renewDomainn(
	domain: Domain,
	opts: RenewDomainOptions,
): Promise<Domain> {
	await Auth.check({
		action: "renew",
		resource: "domain",
		resourceId: domain.name,
		userId: opts.userId,
	});

	const price = await Registrar.getPrice(domain.name, {
		type: "renewal",
		years: opts.years,
	});

	await Billing.charge(opts.userId, { amount: price, sku: "domain-renewal" });

	const renewedDomain = await Registrar.renew(domain.name, {
		expectedPrice: price,
		years: opts.years,
	});

	const updatedDomain = await Db.update("domains", renewedDomain);

	return updatedDomain;
}
