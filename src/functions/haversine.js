// -- Libraries -- \\
import haversineDistance from 'haversine-distance';
import { fetch } from 'undici';

const factoryCoordinates = {
    IT: { latitude: 41.8719, longitude: 12.5674 },
    BR: { latitude: -14.2350, longitude: -51.9253 },
    VN: { latitude: 14.0583, longitude: 108.2772 },
};

async function retriveGeoData(address) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
        const results = await res.json();

        if (!results?.[0]) return null;
        return { latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) };
    } catch {
        return null;
    }
}

function findNearestFactory(coord) {
    let nearestFactory = null;
    let minDistance = Infinity;

    for (const [factoryCode, factoryCoord] of Object.entries(factoryCoordinates)) {
        const dist = haversineDistance(coord, factoryCoord);
        if (dist < minDistance) {
            minDistance = dist;
            nearestFactory = factoryCode;
        }
    }

    return { factoryCode: nearestFactory, distance: minDistance };
}

export async function haversine(address) {
    const coord = await retriveGeoData(address);
    if (!coord) return null;

    return findNearestFactory(coord);
}
