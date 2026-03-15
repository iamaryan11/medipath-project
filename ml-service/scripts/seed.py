import pandas as pd
import requests
import json
import os

CSV_FILE_PATH = 'final_master_tricity.csv'
API_ENDPOINT = 'http://localhost:1111/api/hospitals/seed'

def seed_data():
    print("🚀 Starting seed script...")
    
    # Check if file exists first
    if not os.path.exists(CSV_FILE_PATH):
        print(f"❌ ERROR: File not found at {os.path.abspath(CSV_FILE_PATH)}")
        return

    try:
        # Load CSV and handle the tab/comma/encoding issues
        df = pd.read_csv(CSV_FILE_PATH) 
        print(f"📊 Loaded {len(df)} hospitals from CSV.")
    except Exception as e:
        print(f"❌ ERROR loading CSV: {e}")
        return

    for index, row in df.iterrows():
        # Map CSV 'category' to Schema 'type'
        cat = str(row.get('category', 'Private')).lower()
        h_type = "Government" if "public" in cat or "gov" in cat else "Private"

        payload = {
            "name": str(row['name']).strip(),
            "type": h_type,
            "specialties": [s.strip() for s in str(row.get('specialties', '')).split(',') if s.strip()],
            "contactNumber": str(row.get('contact', 'N/A')),
            "emergency24x7": str(row.get('emergency')).strip().lower() == 'yes',
            "totalBeds": int(row.get('total_beds', 0)) if str(row.get('total_beds')).isdigit() else 0,
            "location": {
                "type": "Point",
                "coordinates": [float(row['longitude']), float(row['latitude'])] 
            },
            "address": {
                "street": "N/A",
                "city": str(row.get('city', 'Chandigarh')).strip(),
                "sector": str(row.get('sector', 'N/A')).strip()
            }
        }
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Content-Type': 'application/json'
        }
        try:
            response = requests.post(API_ENDPOINT, json=payload, headers=headers)
            if response.status_code == 201:
                print(f"✅ Added: {row['name']}")
            else:
                print(f"❌ Failed {row['name']} (Status {response.status_code}): {response.text}")
        except Exception as e:
            print(f"📡 Connection Error on {row['name']}: {e}")

    print("🏁 Seeding complete.")

if __name__ == "__main__":
    seed_data()