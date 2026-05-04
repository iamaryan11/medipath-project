import requests
def calculate_osrm_route(start_lat, start_lng, end_lat, end_lng):
    """
    Calls the free public OSRM API to get the real road route.
    OSRM takes coordinates in longitude,latitude format.
    """
    url = f"https://router.project-osrm.org/route/v1/driving/{start_lng},{start_lat};{end_lng},{end_lat}?overview=full&geometries=geojson"
    
    headers = {
        "User-Agent": "MediPath_Router/1.0 (Integration for College Project)"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        if data.get("code") == "Ok" and len(data.get("routes", [])) > 0:
            route = data["routes"][0]
            distance_km = route["distance"] / 1000.0  
            duration_minutes = route["duration"] / 60.0  
            geometry = route["geometry"] 
            return {
                "success": True,
                "distance_km": round(distance_km, 2),
                "duration_minutes": round(duration_minutes, 2),
                "geometry": geometry
            }
        else:
            return {"success": False, "message": "No route found by OSRM."}
    except Exception as e:
        print(f"OSRM Routing Error: {e}")
        return {"success": False, "message": str(e)}
