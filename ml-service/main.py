from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import math 
from sklearn.neighbors import BallTree
# Import the logic from our new file
from router import calculate_dijkstra
app = FastAPI()
try:
    df = pd.read_csv("final_master_tricity.csv")
    # Convert Lat/Long to Radians for Haversine formula
    hospital_coords = np.deg2rad(df[['latitude', 'longitude']].values)
    
    # 2. Build the KNN Model (BallTree is best for Earth coordinates)
    # metric='haversine' ensures we calculate distance on a sphere
    tree = BallTree(hospital_coords, metric='haversine')
    print(" KNN Model Trained on Tri-City Data")
except Exception as e:
    print(f" Error loading ML data: {e}")

class Location(BaseModel):
    latitude: float
    longitude: float
    k: int = 5

@app.post("/recommend")
async def recommend_hospitals(loc: Location):
    try:
        # Convert user input to Radians
        user_coord = np.deg2rad([[loc.latitude, loc.longitude]])
        
        # 3. Query the Tree for 'K' nearest neighbors
        # distances are in radians, indices are the row numbers in our CSV/DB
        dist, ind = tree.query(user_coord, k=loc.k)
        
        # Convert distance to Kilometers (Earth radius = 6371km)
        kms = dist[0] * 6371
        
        results = []
        for i in range(len(ind[0])):
            row_index = ind[0][i]
            results.append({
                "name": df.iloc[row_index]['name'],
                "distance_km": round(kms[i], 2),
                "latitude": df.iloc[row_index]['latitude'],
                "longitude": df.iloc[row_index]['longitude'],
                "type": df.iloc[row_index].get('type', 'Private')
            })
            
        return {"status": "success", "recommendations": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class RouteRequest(BaseModel):
    start: str
    end: str

@app.post("/calculate-route")
async def get_route(request: RouteRequest):
    path, distance = calculate_dijkstra(request.start, request.end)
    if path is None or math.isinf(distance):
        return {
            "success": False,
            "message": f"No road connection found between {request.start} and {request.end}",
            "path": [],
            "total_distance_km": None
        }
    return {
        "success": True,
        "path": path,
        "total_distance_km": round(distance, 2)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)