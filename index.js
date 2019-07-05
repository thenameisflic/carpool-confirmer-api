const QRCode = require("qrcode");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())

const port = 3000;
const data = {};

app.post("/ride", async (req, res) => {
    const { position } = req.body;
    const id = randomString(3);
    data[id] = {
        passengerScanned: false,
        driverPosition: position,
        passengerPosition: null,
        createdAt: new Date(),
    };
    return res.json({dataUrl: await QRCode.toDataURL(id), id});
});

app.get(["/ride/:id", "/ride/:id/*"], (req, res, next) => {
    const { id } = req.params;
    if (!data[id])
        return res.status(404).json({error: "Ride not found"});
    next();
});

app.get("/ride/:id", async (req, res) => {
    const { id } = req.params;
    return res.json(withDistance({id, ...data[id]}));
});

app.post("/ride/:id/scan-passenger", async (req, res) => {
    const { id } = req.params;
    const { position } = req.body; 
    data[id].passengerScanned = true;
    data[id].passengerPosition = position;
    return res.json(withDistance({id, ...data[id]}));
});

app.post("/ride/:id/confirm-driver", async (req, res) => {
    const { id } = req.params;
    const { position } = req.body; 
    data[id].driverPosition = position;
    return res.json(withDistance({id, ...data[id]}));
});

app.post("/ride/:id/confirm-passenger", async (req, res) => {
    const { id } = req.params;
    const { position } = req.body; 
    data[id].passengerPosition = position;
    return res.json(withDistance({id, ...data[id]}));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function withDistance(data) {
    let distance = null;
    if (data.driverPosition && data.passengerPosition) {
        distance = getDistanceFromLatLon(data.driverPosition, data.passengerPosition);
    }
    return {...data, distance};
}

/** Utilities */
function randomString(length) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
  
// In kM
function getDistanceFromLatLon(p1,p2) {
    const lat1 = p1.split(",")[0];
    const lon1 = p1.split(",")[1];
    const lat2 = p2.split(",")[0];
    const lon2 = p2.split(",")[1];
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return Math.round(d * 1000);
}
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}