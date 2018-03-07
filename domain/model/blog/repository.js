export const findAll = async session => {
	const result = await session.run(
		`MATCH (blog:Blog) RETURN blog`
	);

	if (result.records.length) {
		return result.records.map(record => record._fields[0].properties);
	}

	return [];
};

export const findOneById = async (session, id) => {
	const result = await session.run(
		`MATCH (blog:Blog {id: $id}) RETURN blog`,
		{id}
	);

	if (result.records.length) {
		return result.records[0]._fields[0].properties;
	}
};

export const add = async (session, blog) => {
	const result = await session.run(
		`CREATE (blog:Blog {
			id: $id,
			title: $title
		}) RETURN blog`,
		blog
	);

	if (result.records.length) {
		return result.records[0]._fields.properties;
	}
}
