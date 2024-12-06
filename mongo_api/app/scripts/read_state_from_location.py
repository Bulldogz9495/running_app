from datetime import datetime
import reverse_geocoder as rg


if __name__ == "__main__":
    geopoint = {"latitude": "38.897262814488606","longitude": "-78.07066551139845"}
    state_data = rg.search((geopoint['latitude'], geopoint['longitude']))[0]
    print(state_data)
