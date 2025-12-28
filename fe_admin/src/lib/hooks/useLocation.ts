import { useState, useEffect } from "react";  
import { locationAPI } from "../services/locationAPI";
import { Province, District, Ward } from "../types/location";

export default function useLocation() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProvinces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationAPI.getProvinces();
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      setError("Không thể tải danh sách tỉnh/thành phố");
    } finally {
      setLoading(false);
    }
  };

  const getDistricts = async (province_code: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationAPI.getDistricts(province_code);
      // API trả về districts trong province object
      setDistricts(response.data.districts || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setError("Không thể tải danh sách quận/huyện");
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  const getWards = async (district_code: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationAPI.getWards(district_code);
      // API trả về wards trong district object
      setWards(response.data.wards || []);
    } catch (error) {
      console.error("Error fetching wards:", error);
      setError("Không thể tải danh sách phường/xã");
      setWards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProvinces();
  }, []);

  return { provinces, districts, wards, loading, error, getProvinces, getDistricts, getWards };
}
