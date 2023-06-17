// import { Measurement } from "../models/measurement.js";
// import { Port } from "../models/port.js";
// import { PortScanner } from "../models/port-scanner.js";
// import { PortStatus } from "../models/port-status.js";
// import { ScanResult } from "../models/scan-result.js";

// let to_scan: any;
// let brute_addresses: any;
// let ports: any;

// export const webRtcScan: PortScanner = async (
//   port: Port,
//   timeout: number
// ): Promise<ScanResult> => {
//   console.log(`Webrtc scan for port ${port.number}`);

//   const start = performance.now();
//   let end = 0;

//   const conn = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: `stun:${port.ipaddress}:${port.number}`
//       }
//     ]
//   });

//   conn.onicecandidate = function (e) {
//     if (e.candidate === null) {
//       console.log(`candidate is NULL so port: ${port.number} is closed`);
//       conn.close();
//       return;
//     }
//     console.log(`candidate url: ${e.url}`);
//     console.log(`candidate: ${JSON.stringify(e.candidate)}`);
//   };

//   conn.oniceconnectionstatechange = function (e) {
//     const connectionState = conn.iceConnectionState;
//     console.log("ICE connection state:", connectionState);

//     if (connectionState === "connected") {
//       console.log("RTCPeerConnection connected to STUN server.");
//       end = performance.now() - start;
//     } else if (
//       connectionState === "failed" ||
//       connectionState === "disconnected" ||
//       connectionState === "closed"
//     ) {
//       console.log(`RTCPeerConnection connection: ${connectionState}`);
//       end = performance.now() - start;
//     }

//     if (conn.iceGatheringState == "complete") {
//       conn.close();
//       console.log(`SCAN COMPLETE FOR ${port.number}`);
//       // if (conn != null) {
//       //   iceScan(local_address, port);
//       // } else {
//       //   console.log("Moving to brute force")
//       //   bruteForceAddress(port);
//       // }
//     }
//   };

//   conn.onicecandidateerror = function (e) {
//     end = performance.now() - start;
//     const iceErrorEvent = e as RTCPeerConnectionIceErrorEvent;
//     if (iceErrorEvent.errorCode == 701) {
//       port.status = PortStatus.CLOSE;
//       console.log("Closing because code was 701");
//       return;
//     }

//     console.log("ON CANDIDATE ERROR");

//     if (iceErrorEvent.url == null) {
//       return;
//     }

//     console.log(
//       `IceErrorEvent address: ${iceErrorEvent.address}, errorCode: ${iceErrorEvent.errorCode}, errorText: ${iceErrorEvent.errorText}, url: ${iceErrorEvent.url}`
//     );
//     console.log(`ICEerrorEvent host candidate: ${iceErrorEvent.hostCandidate}`);
//   };

//   conn.createDataChannel("portScan");

//   conn.createOffer().then((offer) => {
//     console.log(
//       `OFFER CREATED for port ${port.number}: ${JSON.stringify(offer)}`
//     );
//     conn.setLocalDescription(
//       new RTCSessionDescription(offer),
//       () => {
//         console.log(
//           `SET LOCAL DESCRIPTION SUCCESFULLY WITH OFFER: ${JSON.stringify(
//             offer
//           )}`
//         );
//       },
//       (error) => console.log(`SET LOCAL DESCRIPTOR ERROR: ${error}`)
//     );
//   });

//   const measurement: Measurement = {
//     duration: end,
//     timedOut: false,
//     receivedData: false
//   };

//   const result: ScanResult = { port, measurement };
//   return result;
// };

// function findInternalIP(port: Port) {
//   let local_address: any = null;
//   const localpc = new RTCPeerConnection();
//   localpc.createDataChannel("", {});

//   // For each new ICE candidate, filter out v6 or mdns addresses, and select *one*
//   // local address. Last one wins (note: even with multiple interfaces, I've only seen
//   // one local address given anyways).
//   localpc.onicecandidate = function (e) {
//     if (e.candidate == null) {
//       console.log("e.candidate is null");
//       return;
//     }

//     local_address = e.candidate.address;
//     console.log(`Local address: ${local_address}`);
//   };

//   // Once candidate gathering has completed, check to see if we found a local address.
//   // If we have, awesome! Move on to LAN scanning. If not, we'll need to move on to
//   // brute forcing instead.
//   localpc.onicegatheringstatechange = function (e) {
//     if (localpc.iceGatheringState == "complete") {
//       localpc.close();

//       if (local_address != null) {
//         iceScan(local_address, port);
//       } else {
//         console.log("Moving to brute force");
//         bruteForceAddress(port);
//       }
//     }
//   };

//   // trigger the gathering of ICE candidates
//   localpc.createOffer(
//     function (description) {
//       localpc.setLocalDescription(description);
//     },
//     function (e) {
//       console.log("Create offer failed callback.");
//     }
//   );
// }

// function bruteForceAddress(port: Port) {
//   // generate the 256 192.168.x.1 TURN uri. They'll take the following form:
//   //
//   // turn:192.168.0.1:445?transport=tcp
//   //
//   // Which will get Chrome to send a TCP/TURN request to port 445 on 192.168.0.1.
//   // The port *does* matter. I've chosen 445 because it will either be unpopulated
//   // *or* the protocol *should* reject the initial message from the browser. Meaning,
//   // an onicecandidateerror will be generated quickly.
//   const brute_array = [];
//   for (let i = 0; i < 256; i++) {
//     const brute_address = "turn:192.168." + i + ".1:445?transport=tcp";
//     brute_array.push({
//       urls: brute_address,
//       credential: "lobster",
//       username: "albino"
//     });
//   }

//   // create a new peer connection using the array we just created as the ICE servers.
//   // Note that I'm not sure iceCandidatePoolSize is helpful here, but I assumed it didn't hurt either.
//   const rtc_brute = new RTCPeerConnection({
//     iceServers: brute_array,
//     iceCandidatePoolSize: 0
//   });
//   rtc_brute.createDataChannel("", {});

//   // Any ICE candidate that returns back to us is considered "active." At this time, Chrome doesn't
//   // generate candidate errors for addresses that don't exist.
//   rtc_brute.onicecandidateerror = function (e) {
//     const iceErrorEvent = e as RTCPeerConnectionIceErrorEvent;
//     if (iceErrorEvent.url == null) {
//       return;
//     }

//     const url_split = iceErrorEvent.url.split(":");
//     brute_addresses.push(url_split[1]);
//   };

//   // After scanning_timeout milliseconds stop the ICE candidate gathering and shutdown this
//   // peerconnection. If we found addresses we can move on to scanning. If we didn't find anything
//   // then they host probably isn't on a 192.168.0.0/16 subnet sooooo we can't do anything else.
//   setTimeout(function () {
//     rtc_brute.close();
//     if (brute_addresses.length > 0) {
//       const address = brute_addresses.pop();
//       iceScan(address, port);
//     } else {
//       console.log("Brute forcing failed. Done.");
//     }
//   }, 60000);

//   // trigger the gathering of ICE candidates
//   rtc_brute.createOffer(
//     function (offerDesc) {
//       rtc_brute.setLocalDescription(offerDesc);
//     },
//     function (e) {
//       console.log("Create offer failed callback.");
//     }
//   );
// }

// // iceScan takes the provided address, assumes that the address is in a /24, and scans 254
// // addresses within that space (.0 and .255 aren't scanned). The scanning is done WebRTC
// // ICE candidate scanning (for me details on that see the header). Assuming we find
// // active hosts, this function will then move on to ipScan().
// function iceScan(address: any, port: Port) {
//   console.log("Scanning local network for active hosts.");

//   // drop the octet and pretend that's the subnet.
//   const subnet = address.substr(0, address.lastIndexOf("."));

//   // generate the 254 "subnet" TURN uri. They'll take the following form:
//   //
//   // turn:x.x.x.[1-254]:445?transport=tcp
//   //
//   // Which will get Chrome to send a TCP/TURN request to port 445 on x.x.x.[1-254].
//   // The port *does* matter. I've chosen 445 because it will either be unpopulated
//   // *or* the protocol *should* reject the initial message from the browser. Meaning,
//   // an onicecandidateerror will be generated quickly.
//   const address_array = [];
//   for (let i = 1; i < 255; i++) {
//     const probe_address = "turn:" + subnet + "." + i + ":445?transport=tcp";
//     address_array.push({
//       urls: probe_address,
//       credential: "helter",
//       username: "skelter"
//     });
//   }

//   // create a new peer connection using the array we just created as the ICE servers.
//   // Note that I'm not sure iceCandidatePoolSize is helpful here, but I assumed it didn't hurt either.
//   const rtc_scan = new RTCPeerConnection({
//     iceServers: address_array,
//     iceCandidatePoolSize: 0
//   });

//   rtc_scan.createDataChannel("", {});

//   // Any ICE candidate that returns back to us is considered "active." At this time, Chrome doesn't
//   // generate candidate errors for addresses that don't exist.
//   rtc_scan.onicecandidateerror = function (e) {
//     const iceErrorEvent = e as RTCPeerConnectionIceErrorEvent;

//     if (iceErrorEvent.url == null) {
//       return;
//     }

//     const url_split = iceErrorEvent.url.split(":");
//     console.log(`URL SPLIT: ${url_split}`);
//     to_scan.push(url_split[1]);
//   };

//   // After scanning_timeout milliseconds stop the ICE candidate gathering and shutdown this
//   // peerconnection. If we have other subnets to scan, then call iceScan again. Otherwise,
//   // if we found addresses we can move on to scanning.
//   setTimeout(function () {
//     rtc_scan.close();
//     if (brute_addresses.length > 0) {
//       address = brute_addresses.pop();
//       iceScan(address, port);
//     } else {
//       ipScan(port);
//     }
//   }, 60000);

//   // trigger the gathering of ICE candidates
//   rtc_scan.createOffer(
//     function (offerDesc) {
//       rtc_scan.setLocalDescription(offerDesc);
//     },
//     function (e) {
//       console.log("Create offer failed callback.");
//     }
//   );
// }

// function ipScan(port: Port) {
//   // generate the to_scan * ports TURN uri. They'll take the following form:
//   //
//   // turn:x.x.x.x:y?transport=tcp
//   //
//   // Which will get Chrome to send a TCP/TURN request to port y on x.x.x.x. For each server,
//   // we do expect a response (unless the host is configured to not respond) in the form of an
//   // icecandidateerror event.
//   const address_array = [];
//   for (let i = 0; i < to_scan.length; i++) {
//     for (let j = 0; j < ports.length; j++) {
//       const probe_address =
//         "turn:" + port.ipaddress + ":" + port.number + "?transport=tcp";
//       address_array.push({
//         urls: probe_address,
//         credential: "helter",
//         username: "skelter"
//       });
//     }
//   }

//   const port_scan = new RTCPeerConnection({
//     iceServers: address_array,
//     iceCandidatePoolSize: 0
//   });
//   port_scan.createDataChannel("", {});

//   // We can use the icecandidateerror event messages to tell us if a port is closed or if a port is open.
//   // We know its open if:
//   //
//   // -  The event contains a hostCandidate that *isn't* 0.0.0.x:0. The host candidate will take the form
//   //    192.168.88.x:62798... this means the TCP connection was established. If the initial message from
//   //    the client causes the server to kill the connection then the event should show up quickly with an
//   //    empty errorText (ideal). However, if the server keeps the connection open then it will take ~40
//   //    seconds or so for the connection to timeout. When that happens, the event will contain the errortext
//   //    "TURN allocate request timed out."
//   //
//   // On the flip side we know the remote port is closed if the hostCandidate is 0.0.0.x:0.
//   port_scan.onicecandidateerror = function (e) {
//     const iceErrorEvent = e as RTCPeerConnectionIceErrorEvent;
//     if (iceErrorEvent.url == null) {
//       return;
//     }

//     const url_split = iceErrorEvent.url.split(":");
//     const port_split = url_split[2].split("?");

//     if (iceErrorEvent.hostCandidate != "0.0.0.x:0") {
//       console.log("PORT IS OPEN");
//     } else {
//       console.log("PORT IS CLOSED");
//     }
//   };

//   // If it's still running, kill the scan after 60 seconds. It's possible that the scan is still in
//   // the gathering state. This occurs when there is no response to a request. It's no big deal.
//   // Leave those ports flagged as '?' and we'll pretend those are filtered.
//   setTimeout(function () {
//     if (port_scan.iceGatheringState === "gathering") {
//       console.log("CONNECTION TIMED OUT");
//       port_scan.close();
//     }
//   }, 60000);

//   // If we get notice that the scan has completed, then close the peer and inform the user that
//   // we're all done here.
//   port_scan.onicegatheringstatechange = function (e) {
//     if (port_scan.iceGatheringState == "complete") {
//       console.log("COMPLETE. DONE.");
//       port_scan.close();
//     }
//   };

//   // trigger the gathering of ICE candidates
//   port_scan.createOffer(
//     function (offerDesc) {
//       port_scan.setLocalDescription(offerDesc);
//     },
//     function (e) {
//       console.log("Create offer failed callback.");
//     }
//   );
// }
