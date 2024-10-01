export const errorHandler = async (err, req, res, next) => {
  console.log(`error:${err.message}`);
  res.status(err.status).json(err.message);   
};
