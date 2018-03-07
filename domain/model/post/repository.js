export const findAllByBlog = async (session, blog) => {
	const result = await session.run(
		`MATCH (post:Post {blog_id: $blogId}) RETURN post`,
		{blogId: blog.id}
	);


	if (result.records.length) {
		return result.records.map(record => record._fields[0].properties);
	}

	return [];
};

export const findOneById = async (session, id) => {
	const result = await session.run(
		`MATCH (post:Post {id: $id}) RETURN post`,
		{id}
	);

	if (result.records.length) {
		return result.records[0]._fields.properties;
	}
};

export const add = async (session, blog, post) => {
	const result = await session.run(
		`
			MATCH (blog:Blog)
			WHERE blog.id = $blogId
			CREATE (post:Post {
				id: $id,
				title: $title,
				content: $content
			})->[postedIn:POSTED_IN]->(blog)
			RETURN post
		`,
		Object.assign({}, {blogId: blog.id}, post)
	);

	if (result.records.length) {
		return result.records[0]._fields.properties;
	}
}
