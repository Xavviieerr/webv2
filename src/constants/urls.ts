const routeCreator = (
  path: string,
  method: "get" | "post" | "put" | "delete" = "get"
) => {
  return {
    path,
    method,
  };
};

const INTERNALS = {
  base: "https://guono.up.railway.app",
  start: "/start",
  Guọnọpedia: { base: "/Guọnọpedia" },
};

const EXTERNALS = {
  base: process.env.NEXT_PUBLIC_BASE_API_URL,
  // base: "https://guono-backend-dev.up.railway.app/",
  auth: {
    entry: routeCreator("/auth"),
    login: routeCreator("/login", "post"),
  },
  dictionary: {
    search: {
      entry: routeCreator("/search"),
    },
  },
};

export const URLS = { INTERNALS, EXTERNALS };
