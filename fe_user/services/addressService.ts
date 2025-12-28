// Service để xử lý tìm kiếm địa chỉ và geocoding với OpenStreetMap + Nominatim
export interface AddressResult {
  place_id: string;
  formatted_address: string;
  name?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  photos?: string[];
  vicinity?: string;
  display_name?: string;
  osm_type?: string;
  osm_id?: string;
}

export interface AutocompleteResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  display_name?: string;
  lat?: string;
  lon?: string;
}

class AddressService {
  // OpenStreetMap + Nominatim API (miễn phí, không cần API key)
  private readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
  private readonly USER_AGENT = 'HuyViVu-TourApp/1.0'; // User agent bắt buộc cho Nominatim

  // Tìm kiếm autocomplete địa chỉ với Nominatim
  async searchAddress(query: string, location?: { lat: number; lng: number }): Promise<AutocompleteResult[]> {
    try {
      if (!query.trim()) return [];

      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '10',
        countrycodes: 'vn', // Chỉ tìm kiếm trong Việt Nam
        'accept-language': 'vi,en', // Ưu tiên tiếng Việt
      });

      // Thêm location bias nếu có
      if (location) {
        params.append('viewbox', `${location.lng-0.1},${location.lat-0.1},${location.lng+0.1},${location.lat+0.1}`);
        params.append('bounded', '1');
      }

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?${params}`,
        {
          headers: {
            'User-Agent': this.USER_AGENT,
          },
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        return data.map((item: any, index: number) => ({
          place_id: `${item.osm_type}_${item.osm_id}_${index}`,
          description: item.display_name,
          structured_formatting: {
            main_text: this.extractMainText(item),
            secondary_text: this.extractSecondaryText(item),
          },
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching address:', error);
      return [];
    }
  }

  // Helper function để extract main text từ Nominatim result
  private extractMainText(item: any): string {
    const address = item.address || {};
    const parts = [];
    
    // Ưu tiên tên địa điểm hoặc địa chỉ cụ thể
    if (item.name && item.name !== item.display_name) {
      parts.push(item.name);
    } else if (address.house_number && address.road) {
      parts.push(`${address.house_number} ${address.road}`);
    } else if (address.road) {
      parts.push(address.road);
    } else if (address.suburb) {
      parts.push(address.suburb);
    } else if (address.city_district) {
      parts.push(address.city_district);
    } else {
      // Fallback: lấy phần đầu của display_name
      const displayParts = item.display_name.split(',');
      parts.push(displayParts[0]?.trim() || 'Địa điểm');
    }
    
    return parts[0] || 'Địa điểm';
  }

  // Helper function để extract secondary text từ Nominatim result
  private extractSecondaryText(item: any): string {
    const address = item.address || {};
    const parts = [];
    
    // Tạo địa chỉ phụ từ các thành phần
    if (address.city_district) parts.push(address.city_district);
    if (address.city || address.town) parts.push(address.city || address.town);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ') || item.display_name.split(',').slice(1).join(',').trim();
  }

  // Lấy thông tin chi tiết địa chỉ từ place_id (Nominatim)
  async getPlaceDetails(placeId: string): Promise<AddressResult | null> {
    try {
      // Parse place_id để lấy osm_type và osm_id
      const [osm_type, osm_id] = placeId.split('_');
      
      if (!osm_type || !osm_id) {
        return null;
      }

      const params = new URLSearchParams({
        osm_ids: `${osm_type.toUpperCase()}${osm_id}`,
        format: 'json',
        addressdetails: '1',
        'accept-language': 'vi,en',
      });

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/lookup?${params}`,
        {
          headers: {
            'User-Agent': this.USER_AGENT,
          },
        }
      );

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        return {
          place_id: placeId,
          formatted_address: item.display_name,
          name: item.name || this.extractMainText(item),
          geometry: {
            location: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            },
          },
          types: this.mapOsmTypeToTypes(item.type),
          display_name: item.display_name,
          osm_type: item.osm_type,
          osm_id: item.osm_id,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  // Helper function để map OSM type sang Google Places types
  private mapOsmTypeToTypes(osmType: string): string[] {
    const typeMapping: { [key: string]: string[] } = {
      'restaurant': ['restaurant', 'food'],
      'cafe': ['cafe', 'food'],
      'hotel': ['lodging', 'hotel'],
      'shop': ['store', 'shopping'],
      'bank': ['finance', 'bank'],
      'hospital': ['health', 'hospital'],
      'school': ['education', 'school'],
      'university': ['education', 'university'],
      'museum': ['tourist_attraction', 'museum'],
      'park': ['park', 'tourist_attraction'],
      'tourism': ['tourist_attraction'],
      'amenity': ['establishment'],
      'building': ['establishment'],
      'highway': ['route'],
      'waterway': ['natural_feature'],
      'natural': ['natural_feature'],
      'place': ['establishment'],
    };

    for (const [key, types] of Object.entries(typeMapping)) {
      if (osmType.includes(key)) {
        return types;
      }
    }

    return ['establishment'];
  }

  // Geocoding - chuyển đổi địa chỉ thành tọa độ với Nominatim
  async geocodeAddress(address: string): Promise<AddressResult | null> {
    try {
      const params = new URLSearchParams({
        q: address,
        format: 'json',
        addressdetails: '1',
        limit: '1',
        countrycodes: 'vn', // Ưu tiên kết quả từ Việt Nam
        'accept-language': 'vi,en',
      });

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?${params}`,
        {
          headers: {
            'User-Agent': this.USER_AGENT,
          },
        }
      );

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        return {
          place_id: `${item.osm_type}_${item.osm_id}`,
          formatted_address: item.display_name,
          name: item.name || this.extractMainText(item),
          geometry: {
            location: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            },
          },
          types: this.mapOsmTypeToTypes(item.type),
          display_name: item.display_name,
          osm_type: item.osm_type,
          osm_id: item.osm_id,
        };
      }

      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Reverse geocoding - chuyển đổi tọa độ thành địa chỉ với Nominatim
  async reverseGeocode(lat: number, lng: number): Promise<AddressResult | null> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
        addressdetails: '1',
        'accept-language': 'vi,en',
      });

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/reverse?${params}`,
        {
          headers: {
            'User-Agent': this.USER_AGENT,
          },
        }
      );

      const data = await response.json();

      if (data && data.display_name) {
        return {
          place_id: `${data.osm_type}_${data.osm_id}`,
          formatted_address: data.display_name,
          name: data.name || this.extractMainText(data),
          geometry: {
            location: {
              lat: parseFloat(data.lat),
              lng: parseFloat(data.lon),
            },
          },
          types: this.mapOsmTypeToTypes(data.type),
          display_name: data.display_name,
          osm_type: data.osm_type,
          osm_id: data.osm_id,
        };
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Tìm kiếm địa điểm gần vị trí hiện tại với Nominatim
  async searchNearby(
    location: { lat: number; lng: number },
    radius: number = 1000,
    type?: string
  ): Promise<AddressResult[]> {
    try {
      // Tính viewbox dựa trên radius
      const latOffset = radius / 111000; // 1 độ lat ≈ 111km
      const lngOffset = radius / (111000 * Math.cos(location.lat * Math.PI / 180));
      
      const params = new URLSearchParams({
        q: type || 'restaurant|hotel|tourist_attraction|shop',
        format: 'json',
        addressdetails: '1',
        limit: '20',
        countrycodes: 'vn',
        'accept-language': 'vi,en',
        viewbox: `${location.lng - lngOffset},${location.lat - latOffset},${location.lng + lngOffset},${location.lat + latOffset}`,
        bounded: '1',
      });

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?${params}`,
        {
          headers: {
            'User-Agent': this.USER_AGENT,
          },
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          place_id: `${item.osm_type}_${item.osm_id}`,
          formatted_address: item.display_name,
          name: item.name || this.extractMainText(item),
          geometry: {
            location: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            },
          },
          types: this.mapOsmTypeToTypes(item.type),
          display_name: item.display_name,
          osm_type: item.osm_type,
          osm_id: item.osm_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching nearby:', error);
      return [];
    }
  }
}

export const addressService = new AddressService();
