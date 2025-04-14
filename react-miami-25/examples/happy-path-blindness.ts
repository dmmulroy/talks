async function renewDomain(
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
