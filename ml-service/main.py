from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import math 
from sklearn.neighbors import BallTree

from router import calculate_osrm_route
import os

app = FastAPI()
try:
    csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "final_master_tricity.csv")
    df = pd.read_csv(csv_path)
    hospital_coords = np.deg2rad(df[['latitude', 'longitude']].values)
    
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
        user_coord = np.deg2rad([[loc.latitude, loc.longitude]])
        
        dist, ind = tree.query(user_coord, k=loc.k)
        
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
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float

@app.post("/calculate-route")
async def get_route(request: RouteRequest):
    result = calculate_osrm_route(
        request.start_lat, request.start_lng, 
        request.end_lat, request.end_lng
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message", "Route calculation failed"))
        
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)