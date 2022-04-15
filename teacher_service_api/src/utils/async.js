const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next))
  .catch((error) => { 
    console.log(error)
    next(error, req, res);
   });

export default asyncHandler;
