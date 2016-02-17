
module.exports = function(req, res, next){
  try{
    next();
  }catch(e){
    res.end(String(e.stack));
  }
}
