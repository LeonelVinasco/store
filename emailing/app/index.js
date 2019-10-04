var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('383892342f26ca83f61899a3617618ab-us20');

mandrillClient.users.info({}, function(result){
  console.log(result);
}, function (e){
  console.log(e),
})
var plugin = function(options) {
//send mails including the content
var seneca=this;

seneca.add({area:"email", action:"send", cc:"*"}, function(args, done){
  console.log(args);
  var message={
    "html": args.content,
    "subject": args.subject,
    "to": [{
      "email": args.to,
      "name": args.toName,
      "type":"to"
    }],
    "from_email": "info@tivi.net.co",
    "from_name":"microservice"
  }

  mandrillClient.messages.send({"message":message},
function(result){
  done(null, {status:result.status})
})
})

seneca.add({area:"email", action:"send", template:"*", cc:"*"}, function(args,done){
  console.log("sending");
  var mesage = {
    "subject": args.subject,
    "to": [{
      "email": args.to,
      "name":args.toName,
      "type":"to"
    }],
    "from_email": "info@tivi.net.co",
    "from_name":"Tivi",
    "global_merge_vars":args.vars,
  }
  mandrillClient.messages.sendTemplate(
    {"template_name": args.template, "template_content":{}, "message":message},
    function(result){
      done(null,{status:result.status});
    }, function(e){
      done({code:e.name}, null);
    })
})
}

var seneca = require('seneca')();
seneca.use(plugin);
seneca.act({area:"email", action:"send", subject:"The subject asunto", to: "tivi.net.co",
toName: "test testington", cc: "test2@tivi.net.co"}, function(err,result){
   console.log(err);
   console.log(result)

})
