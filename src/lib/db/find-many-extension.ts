import { Prisma } from "@prisma/client";

export const findManyExtension = Prisma.defineExtension({
  name: "findMany",
  query: {
    $allModels: {
      async findMany({ args, query }) {
        if (!args?.orderBy) {
          args.orderBy = { createdAt: "desc" };
        }

        return query(args);
      },
    },
  },
});
