// const SUM_RATIO_THRESHOLD = 1.3;
// const TIMING_RATIO_THRESHOLD = 0.8;

// const closedPort: Port = {
//   ipaddress: "127.0.0.1",
//   number: 37855,
//   status: PortStatus.CLOSE
// };

// const openPort: Port = {
//   ipaddress: "127.0.0.1",
//   number: 17666,
//   status: PortStatus.OPEN
// };

// const closedPortTiming = await Promise.all(
//   Array.from({ length: NUMBER_OF_MEASUREMENTS }, () =>
//     timePortImage(closedPort)
//   )
// );

// const openPortTimings = await Promise.all(
//   Array.from({ length: NUMBER_OF_MEASUREMENTS }, () =>
//     timePortImage(openPort)
//   )
// );

// console.log(`CLOSED PORT SUM: ${sumOfNumbersInArray(closedPortTiming)}`)
// console.log(`OPEN PORT SUM: ${sumOfNumbersInArray(openPortTimings)}`)

// Timing based on resolving pngs, seems unreliable so far (or at least takes a long time to run)
// export function timePortImage(port: Port): Promise<number> {
//   return new Promise((resolve, reject) => {
//     const t0 = performance.now();
//     // a random appendix to the URL to prevent caching
//     const random = Math.random().toString().replace("0.", "").slice(0, 7);
//     const img = new Image();
//     img.onerror = function (err) {
//       var elapsed = performance.now() - t0;
//       resolve(parseFloat(elapsed.toFixed(3)));
//     };
//     img.onclose = function (err) {
//       console.log(err);
//     };
//     img.src = `http://${port.ipaddress}:${port.number}/${random}.png`;
//   });
// }

// The sum of all measurements of open port are at least 1.3 times larger than closed port measurements
// export function isPortMeasurementRatioSignificant(
//   sumMeasurementsOpenPort: number,
//   sumMeasurementsClosedPort: number
// ): boolean {
//   return (
//     sumMeasurementsOpenPort >= sumMeasurementsClosedPort * SUM_RATIO_THRESHOLD
//   );
// }

// 80% of all timings measurements of open port are larger than closed port timing measurements
// export function isPortTimingRatioSignificant(
//   openPortTimings: Array<number>,
//   closedPortTimings: Array<number>,
//   numberOfMeasurements: number
// ): boolean {
//   let j = 0;
//   for (let i = 0; i < numberOfMeasurements; i++) {
//     if (openPortTimings[i] > closedPortTimings[i]) {
//       j++;
//     }
//   }
//   return j >= Math.floor(TIMING_RATIO_THRESHOLD * numberOfMeasurements);
// }

//   const socket = new WebSocket(`ws://${port.ipaddress}:${port.number}`);
//   const timer = setTimeout(() => {
//     port.status = PortStatus.TIMEOUT;
//     console.log(
//       `Port: ${port.number} timed out after ${timeout} milliseconds`
//     );
//     socket.close();
//     resolve(port);
//   }, timeout);

//   socket.onopen = async () => {
//     const el = document.getElementById("portScannerStatus");
//     el?.append(`Port: ${port.number} was open`);
//     clearTimeout(timer);
//     port.status = PortStatus.OPEN;
//     socket.close();
//     resolve(port);
//   };

//   socket.onmessage = () => {
//     const el = document.getElementById("portScannerStatus");
//     el?.append(`Received data from port: ${port.number}`);
//     clearTimeout(timer);
//     port.status = PortStatus.MESSAGE;
//     socket.close();
//     resolve(port);
//   };

//   socket.onerror = () => {
//     clearTimeout(timer);
//     port.status = PortStatus.ERROR;
//     console.log(`Port: ${port.number} received error`);
//     socket.close();
//     resolve(port);
//   };

//   socket.onclose = () => {
//     if (
//       port.status !== PortStatus.TIMEOUT &&
//       port.status !== PortStatus.OPEN &&
//       port.status !== PortStatus.MESSAGE &&
//       port.status !== PortStatus.ERROR
//     ) {
//       port.status = PortStatus.CLOSE;
//     }
//     socket.close();
//     console.log(`Port: ${port.number} is closed`);
//     resolve(port);
//   };
// }

// const sumOfOpenPortTimings: number = sumOfNumbersInArray();
// const sumOfClosedPortTimings: number = sumOfNumbersInArray();

// if (
//   isPortMeasurementRatioSignificant(
//     sumOfOpenPortTimings,
//     sumOfClosedPortTimings
//   ) &&
//   isPortTimingRatioSignificant(
//     openPortTimings,
//     closedPortTimings,
//     NUMBER_OF_MEASUREMENTS
//   )
// ) {
// todo: fix html
//   port.status = PortStatus.OPEN;
//   const row = document.createElement("tr");
//   var x = row.insertCell(-1);
//   x.innerHTML = `${port.number}`;
//   var y = row.insertCell(-1);
//   y.innerHTML = `${port.status}`;
//   el?.appendChild(row);
//   resolve(port);
//   return;
// }
// port.status = PortStatus.CLOSE;
// const row = document.createElement("tr");
// var x = row.insertCell(-1);
// x.innerHTML = `${port.number}`;
// var y = row.insertCell(-1);
// y.innerHTML = `${port.status}`;
// el?.appendChild(row);
// resolve(port);
// return;
