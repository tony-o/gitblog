var request = require("request");
var cache = {};
var open = 0;

var setup = function(options){
  if(options.dir && options.dir[0] != "/"){ 
    options.dir = "/" + options.dir; 
  }
  open++;
  console.log("requesting: " + options.dir);
  request.get("https://api.github.com/repos/" + options.username + "/" + options.repo + "/contents" + (options.dir ? options.dir : ""),function(e,r,b){
    b = JSON.parse(b);
    if(b instanceof Array){
      console.log("ARRAY");
      for(var i in b){
        var o2 = JSON.parse(JSON.stringify(options));
        o2.dir = (o2.dir ? o2.dir : "") + "/" + b[i].path;
        open++;
        setup(o2);
      }
    }else if(typeof b == "object"){
      console.log(b);
      console.log("decoding: " + b.content);
      cache[b.path] = (new Buffer(b.content, "base64")).toString("utf-8");
    }
    open--;
    if(open == 0){
      console.log(cache);
    }
  });
};

module.exports = setup;
