import axios from "axios";

const API_BASE = "https://provinces.open-api.vn/api";

export interface Province {
  code: number;
  name: string;
}

export interface District {
  code: number;
  name: string;
}

export interface Ward {
  code: number;
  name: string;
}

export const getProvinces = async (): Promise<Province[]> => {
  const res = await axios.get(`${API_BASE}/p/`);
  return res.data;
};

export const getDistricts = async (provinceCode: number): Promise<District[]> => {
  const res = await axios.get(`${API_BASE}/p/${provinceCode}?depth=2`);
  return res.data.districts;
};

export const getWards = async (districtCode: number): Promise<Ward[]> => {
  const res = await axios.get(`${API_BASE}/d/${districtCode}?depth=2`);
  return res.data.wards;
};
