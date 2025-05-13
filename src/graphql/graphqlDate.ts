import { GraphQLScalarType, Kind } from 'graphql';

export const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'Custom scalar for Date objects',
    serialize(value: any) {
        return new Date(value).toISOString();
    },
    parseValue(value: any) {
        return new Date(value); 
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});