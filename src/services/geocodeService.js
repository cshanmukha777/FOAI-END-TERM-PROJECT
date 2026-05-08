export const getNearestPlace = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'RealTimeISSDashboard/1.0'
        }
      }
    );
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    
    if (data.error) {
      return "Over open water";
    }
    
    const addr = data.address;
    const place = addr.city || addr.town || addr.village || addr.state || addr.country;
    return place ? `${place}${addr.country && addr.country !== place ? `, ${addr.country}` : ''}` : "Over open water";
  } catch (error) {
    console.error('Geocode Error:', error);
    return "Location unavailable";
  }
};
