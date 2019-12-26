var counter = 1;
var action = () => ({
  type: "message",
  id: counter,
  data: {
    message: "hi im a service - " + counter.toString(),
    intent: "success",
    icon: "info-sign"
  }
});
window.addEventListener("message", function(e) {
  console.log(["new message to service -", e.data]);
});
setInterval(function() {
  counter++;
  postMessage(action());
  console.log("message sent");
}, 1500);
