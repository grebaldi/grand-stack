import * as blog from './blog';
import * as post from './post';

export const repository = {
	blog: blog.repository,
	post: post.repository
};

export const typeDefs = /* GraphQL */`
	type Query {
		blogs: [Blog],
		blog(id: ID!): Blog,
		post(id: ID!): Post
	}
	${blog.schema}
	${post.schema}
`;

export const resolvers = {
	Query: {
		blogs: (_, args, {session}) => blog.repository.findAll(session),
		blog: (_, {id}, {session}) => blog.repository.findOneById(session, id),
		post: (_, {id}, {session}) => post.repository.findOneById(session, id)
	},
	Blog: {
		posts: (blog, args, {session}) => post.repository.findAllByBlog(session, blog)
	},
	Post: {
		blog: (post, args, {session}) => blog.repository.findOneByPost(session, post)
	}
};
