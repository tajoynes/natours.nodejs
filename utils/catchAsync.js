//Try/Catch error handling moved outside of code block to keep code clean
//Async error functions refaactored
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
