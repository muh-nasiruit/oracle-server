import { io } from "socket.io-client";

// const serverURl = "http://172.104.174.187:4132";
const serverURl = "http://localhost:4132";
const socket = io(serverURl);

//Event emitters.

export const emitData = (data) => {
    console.log('oracle-logs event triggered!')
  socket.emit("oracle-logs", data);
};

//Event listeners.

export const listenerData = (res) => {
  socket.on("oracle-logs",(d) => {
    // const {lineData} = d;
    console.log('listened oracle-logs event');
    // console.log(d)
    // const myDiv = document.getElementById("data").innerHTML
    res(oldArr => [...oldArr, d])
    // console.log(d)

  })
}