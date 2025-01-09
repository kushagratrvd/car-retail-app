export const createHandler = async (app) => {
    const serverless = (await import('serverless-http')).default;
    return serverless(app);
  };
  
  