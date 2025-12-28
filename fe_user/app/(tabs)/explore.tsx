import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { addressService, AddressResult, AutocompleteResult } from '../../services/addressService';

const { width, height } = Dimensions.get('window');

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'tour' | 'restaurant' | 'hotel' | 'attraction';
  rating?: number;
  image?: string;
}

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 10.8231,
    lng: 106.6297,
    zoom: 13
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [zoomLevel, setZoomLevel] = useState(13);
  
  // Address search states
  const [searchResults, setSearchResults] = useState<AutocompleteResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Removed animation values to fix ReanimatedModule error

  // Real data from Nominatim API
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);

  // Removed animation useEffects to fix ReanimatedModule error

  // Load nearby locations on component mount
  useEffect(() => {
    const loadNearbyLocations = async () => {
      try {
        setIsLoadingNearby(true);
        
        // Tìm kiếm địa điểm gần vị trí hiện tại
        const nearbyPlaces = await addressService.searchNearby(
          { lat: currentLocation.lat, lng: currentLocation.lng },
          2000, // 2km radius
          'restaurant|hotel|tourist_attraction|shop'
        );
        
        if (nearbyPlaces.length > 0) {
          // Convert Nominatim results to Location format
          const locations: Location[] = nearbyPlaces.map((place, index) => ({
            id: place.place_id,
            name: place.name || place.formatted_address.split(',')[0],
            address: place.formatted_address,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            type: place.types.includes('restaurant') ? 'restaurant' :
                  place.types.includes('hotel') ? 'hotel' :
                  place.types.includes('tourist_attraction') ? 'attraction' : 'attraction',
            rating: place.rating,
          }));
          
          setNearbyLocations(locations);
        }
      } catch (error) {
        console.error('Error loading nearby locations:', error);
      } finally {
        setIsLoadingNearby(false);
      }
    };

    loadNearbyLocations();
  }, []);

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length > 2) {
        handleSearchAddress(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchAddress = async (query: string) => {
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      const results = await addressService.searchAddress(query, {
        lat: currentLocation.lat,
        lng: currentLocation.lng
      });
      
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching address:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAddress = async (result: AutocompleteResult) => {
    try {
      setIsSearching(true);
      setSearchError(null);
      const addressDetails = await addressService.getPlaceDetails(result.place_id);
      
      if (addressDetails) {
        setSelectedAddress(addressDetails);
        setSearchQuery(result.description);
        setShowSearchResults(false);
        
        // Update map location
        setCurrentLocation({
          lat: addressDetails.geometry.location.lat,
          lng: addressDetails.geometry.location.lng,
          zoom: 16
        });
        
        // Show bottom sheet with address details
        setShowBottomSheet(true);
      } else {
        setSearchError('Không thể lấy thông tin chi tiết địa chỉ.');
      }
    } catch (error) {
      console.error('Error getting address details:', error);
      setSearchError('Có lỗi xảy ra khi tải thông tin địa chỉ.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleGeocodeSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setSearchError(null);
      const result = await addressService.geocodeAddress(searchQuery);
      
      if (result) {
        setSelectedAddress(result);
        setShowSearchResults(false);
        
        // Update map location
        setCurrentLocation({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          zoom: 16
        });
        
        // Show bottom sheet with address details
        setShowBottomSheet(true);
      } else {
        setSearchError('Không tìm thấy địa chỉ. Vui lòng thử lại với từ khóa khác.');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setSearchError('Có lỗi xảy ra khi tìm kiếm địa chỉ.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchNearby = async () => {
    try {
      setIsLoadingNearby(true);
      setSearchError(null);
      setSearchQuery('Địa điểm gần đây');
      
      // Tìm kiếm địa điểm gần vị trí hiện tại
      const nearbyPlaces = await addressService.searchNearby(
        { lat: currentLocation.lat, lng: currentLocation.lng },
        2000, // 2km radius
        'restaurant|hotel|tourist_attraction|shop'
      );
      
      if (nearbyPlaces.length > 0) {
        // Convert Nominatim results to Location format
        const locations: Location[] = nearbyPlaces.map((place, index) => ({
          id: place.place_id,
          name: place.name || place.formatted_address.split(',')[0],
          address: place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          type: place.types.includes('restaurant') ? 'restaurant' :
                place.types.includes('hotel') ? 'hotel' :
                place.types.includes('tourist_attraction') ? 'attraction' : 'attraction',
          rating: place.rating,
        }));
        
        setNearbyLocations(locations);
        setShowBottomSheet(true);
        setShowSearchResults(false);
      } else {
        setSearchError('Không tìm thấy địa điểm nào gần đây.');
        setNearbyLocations([]);
      }
    } catch (error) {
      console.error('Error searching nearby:', error);
      setSearchError('Có lỗi xảy ra khi tìm kiếm địa điểm gần đây.');
      setNearbyLocations([]);
    } finally {
      setIsLoadingNearby(false);
      setIsSearching(false);
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'tour':
        return 'map';
      case 'restaurant':
        return 'restaurant';
      case 'hotel':
        return 'bed';
      case 'attraction':
        return 'camera';
      default:
        return 'location';
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'tour':
        return '#3B82F6';
      case 'restaurant':
        return '#EF4444';
      case 'hotel':
        return '#10B981';
      case 'attraction':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const generateMapHTML = () => {
    const isSatellite = mapStyle === 'satellite';
    const isHybrid = mapStyle === 'hybrid';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Google Maps</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Roboto', sans-serif;
            background: #f5f5f5;
            overflow: hidden;
          }
          
          #map {
            width: 100%;
            height: 100vh;
            position: relative;
            overflow: hidden;
            background: ${isSatellite ? '#1a1a1a' : isHybrid ? '#2d5a3d' : '#e5e7eb'};
          }
          
          .map-container {
            position: relative;
            width: 100%;
            height: 100%;
            background: ${isSatellite ? 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)' : 
                       isHybrid ? 'linear-gradient(45deg, #2d5a3d 0%, #1e3a2e 100%)' : 
                       'linear-gradient(45deg, #e5e7eb 0%, #f3f4f6 100%)'};
          }
          
          .map-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            ${isSatellite ? `
              background: 
                radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(0, 150, 255, 0.1) 0%, transparent 50%);
            ` : isHybrid ? `
              background: 
                radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.05) 0%, transparent 50%);
            ` : `
              background: 
                radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
            `}
          }
          .location-marker {
            position: absolute;
            width: 20px;
            height: 20px;
            background: #3B82F6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .location-marker:hover {
            transform: scale(1.2);
          }
          .location-marker.tour { background: #3B82F6; }
          .location-marker.restaurant { background: #EF4444; }
          .location-marker.hotel { background: #10B981; }
          .location-marker.attraction { background: #F59E0B; }
          .location-marker.address-marker { 
            background: #EF4444; 
            border: 4px solid white; 
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
            animation: pulse 2s infinite;
          }
          
          .current-location {
            position: absolute;
            width: 30px;
            height: 30px;
            background: #EF4444;
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .map-controls {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .control-btn {
            width: 48px;
            height: 48px;
            background: white;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1);
            cursor: pointer;
            border: 1px solid rgba(0,0,0,0.1);
            font-size: 20px;
            transition: all 0.2s ease;
            position: relative;
          }
          
          .control-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.15);
          }
          
          .control-btn.active {
            background: #4285F4;
            color: white;
            box-shadow: 0 2px 10px rgba(66, 133, 244, 0.3), 0 1px 3px rgba(66, 133, 244, 0.2);
          }
          
          .control-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 24px;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            opacity: 0;
            transition: opacity 0.2s ease;
          }
          
          .control-btn:hover::before {
            opacity: 1;
          }
          
          .zoom-controls {
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .zoom-btn {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            border: none;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.2s ease;
          }
          
          .zoom-btn:hover {
            transform: scale(1.05);
          }
          
          .street-grid {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            ${isSatellite ? `
              background-image: 
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
              background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
            ` : isHybrid ? `
              background-image: 
                linear-gradient(rgba(34,197,94,0.3) 2px, transparent 2px),
                linear-gradient(90deg, rgba(34,197,94,0.3) 2px, transparent 2px),
                linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px);
              background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px;
            ` : `
              background-image: 
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
              background-size: 60px 60px, 60px 60px, 15px 15px, 15px 15px;
            `}
            opacity: ${isSatellite ? '0.8' : isHybrid ? '0.6' : '0.4'};
          }
          
          .map-features {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
          }
          
          .road {
            position: absolute;
            background: ${isSatellite ? '#ffd700' : isHybrid ? '#22c55e' : '#666'};
            border-radius: 2px;
          }
          
          .road.horizontal {
            height: 4px;
            width: 200px;
          }
          
          .road.vertical {
            width: 4px;
            height: 200px;
          }
          
          .building {
            position: absolute;
            background: ${isSatellite ? '#8b4513' : isHybrid ? '#15803d' : '#999'};
            border-radius: 2px;
          }
          
          .park {
            position: absolute;
            background: ${isSatellite ? '#228b22' : isHybrid ? '#16a34a' : '#90ee90'};
            border-radius: 8px;
            opacity: 0.7;
          }
        </style>
      </head>
      <body>
        <div id="map">
          <div class="map-container">
            <div class="map-overlay"></div>
            <div class="street-grid"></div>
            
            <!-- Map Features -->
            <div class="map-features">
              <!-- Roads -->
              <div class="road horizontal" style="top: 20%; left: 10%;"></div>
              <div class="road horizontal" style="top: 40%; left: 5%; width: 300px;"></div>
              <div class="road horizontal" style="top: 60%; left: 15%; width: 250px;"></div>
              <div class="road horizontal" style="top: 80%; left: 8%; width: 200px;"></div>
              
              <div class="road vertical" style="top: 10%; left: 30%; height: 300px;"></div>
              <div class="road vertical" style="top: 20%; left: 60%; height: 250px;"></div>
              <div class="road vertical" style="top: 5%; left: 80%; height: 350px;"></div>
              
              <!-- Buildings -->
              <div class="building" style="top: 25%; left: 35%; width: 40px; height: 60px;"></div>
              <div class="building" style="top: 35%; left: 45%; width: 30px; height: 80px;"></div>
              <div class="building" style="top: 45%; left: 70%; width: 50px; height: 50px;"></div>
              <div class="building" style="top: 65%; left: 25%; width: 35px; height: 70px;"></div>
              <div class="building" style="top: 75%; left: 55%; width: 45px; height: 55px;"></div>
              
              <!-- Parks -->
              <div class="park" style="top: 15%; left: 50%; width: 80px; height: 60px;"></div>
              <div class="park" style="top: 55%; left: 85%; width: 60px; height: 40px;"></div>
            </div>
            
            <!-- Current Location -->
            <div class="current-location" style="top: ${height/2 - 15}px; left: ${width/2 - 15}px;"></div>
            
            <!-- Selected Address Marker -->
            ${selectedAddress ? `
              <div 
                class="location-marker address-marker" 
                style="top: ${(height/2 - 15) + (selectedAddress.geometry.location.lat - currentLocation.lat) * 100}px; left: ${(width/2 - 10) + (selectedAddress.geometry.location.lng - currentLocation.lng) * 100}px; background: #EF4444; border: 4px solid white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);"
                title="${selectedAddress.name || selectedAddress.formatted_address}"
              ></div>
            ` : ''}
            
            <!-- Location Markers -->
            ${nearbyLocations.map(location => `
              <div 
                class="location-marker ${location.type}" 
                style="top: ${(height/2 - 15) + (location.lat - currentLocation.lat) * 100}px; left: ${(width/2 - 10) + (location.lng - currentLocation.lng) * 100}px;"
                onclick="selectLocation('${location.id}')"
                title="${location.name}"
              ></div>
            `).join('')}
            
            <!-- Map Controls -->
            <div class="map-controls">
              <button class="control-btn ${mapStyle === 'standard' ? 'active' : ''}" onclick="setMapStyle('standard')" title="Map">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </button>
              <button class="control-btn ${mapStyle === 'satellite' ? 'active' : ''}" onclick="setMapStyle('satellite')" title="Satellite">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
              <button class="control-btn ${mapStyle === 'hybrid' ? 'active' : ''}" onclick="setMapStyle('hybrid')" title="Hybrid">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </button>
            </div>
            
            <!-- Zoom Controls -->
            <div class="zoom-controls">
              <button class="zoom-btn" onclick="zoomIn()" title="Zoom in">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
              <button class="zoom-btn" onclick="zoomOut()" title="Zoom out">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <script>
          let currentZoom = 13;
          let mapStyle = '${mapStyle}';
          
          function selectLocation(id) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'locationSelected',
              id: id
            }));
          }
          
          function setMapStyle(style) {
            mapStyle = style;
            document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapStyleChanged',
              style: style
            }));
          }
          
          function zoomIn() {
            currentZoom = Math.min(currentZoom + 1, 20);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'zoomChanged',
              zoom: currentZoom
            }));
          }
          
          function zoomOut() {
            currentZoom = Math.max(currentZoom - 1, 1);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'zoomChanged',
              zoom: currentZoom
            }));
          }
          
          // Handle map clicks
          document.getElementById('map').addEventListener('click', function(e) {
            if (e.target.classList.contains('map-overlay') || e.target.classList.contains('street-grid')) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapClicked',
                x: e.clientX,
                y: e.clientY
              }));
            }
          });
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'locationSelected':
          const location = nearbyLocations.find(loc => loc.id === data.id);
          if (location) {
            setSelectedLocation(location);
            setShowBottomSheet(true);
          }
          break;
        case 'mapStyleChanged':
          setMapStyle(data.style);
          break;
        case 'zoomChanged':
          setCurrentLocation(prev => ({ ...prev, zoom: data.zoom }));
          break;
        case 'mapClicked':
          setSelectedLocation(null);
          setShowBottomSheet(false);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      {/* Main Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchIcon}>
          <Ionicons 
            name="search" 
            size={16} 
            color={isSearchFocused ? "#4285F4" : "#5F6368"} 
          />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm trên Google Maps"
          placeholderTextColor="#5F6368"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            setIsSearchFocused(false);
            // Delay hiding results to allow for selection
            setTimeout(() => setShowSearchResults(false), 200);
          }}
        />
        
        {isSearching && (
          <View style={styles.searchButton}>
            <View style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: '#d1d5db',
              borderTopColor: '#3b82f6',
              borderRadius: 10,
            }} />
          </View>
        )}
        
        {searchQuery.length > 0 && !isSearching && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
              setShowSearchResults(false);
            }}
            style={styles.searchButton}
          >
            <View style={styles.searchButtonInner}>
              <Ionicons name="close" size={14} color="#5F6368" />
            </View>
          </TouchableOpacity>
        )}
        
        {/* Voice Search Button */}
        <TouchableOpacity style={styles.searchButton}>
          <View style={styles.searchButtonInner}>
            <Ionicons name="mic" size={16} color="#5F6368" />
          </View>
        </TouchableOpacity>
        
        {/* Nearby Search Button */}
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearchNearby}
          disabled={isLoadingNearby}
        >
          <View style={styles.searchButtonInner}>
            {isLoadingNearby ? (
              <View style={{
                width: 12,
                height: 12,
                borderWidth: 1,
                borderColor: '#5F6368',
                borderTopColor: 'transparent',
                borderRadius: 6,
              }} />
            ) : (
              <Ionicons name="location" size={16} color="#5F6368" />
            )}
          </View>
        </TouchableOpacity>
        
        {/* Menu Button */}
        <TouchableOpacity
          onPress={() => setShowBottomSheet(!showBottomSheet)}
          style={styles.searchButton}
        >
          <View style={styles.searchButtonInner}>
            <Ionicons 
              name="menu" 
              size={16} 
              color="#5F6368" 
            />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <View style={styles.searchResults}>
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsHeaderText}>Địa điểm</Text>
          </View>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.searchResultItem,
                  { backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }
                ]}
                onPress={() => handleSelectAddress(item)}
              >
                <View style={styles.searchResultIcon}>
                  <Ionicons name="location" size={18} color="#4285F4" />
                </View>
                <View style={styles.searchResultContent}>
                  <Text style={styles.searchResultTitle}>
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.searchResultSubtitle}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                </View>
                <View style={styles.searchResultChevron}>
                  <Ionicons name="chevron-forward" size={12} color="#5F6368" />
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      
      {/* No results message */}
      {showSearchResults && searchResults.length === 0 && searchQuery.length > 2 && !isSearching && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            {searchError || 'Không tìm thấy địa điểm nào'}
          </Text>
          <TouchableOpacity
            style={styles.searchButtonSecondary}
            onPress={handleGeocodeSearch}
          >
            <Text style={styles.searchButtonText}>
              Tìm kiếm chính xác
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Error message */}
      {searchError && !showSearchResults && (
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Ionicons name="warning" size={20} color="#EF4444" />
            <Text style={styles.errorText}>
              {searchError}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderLocationCard = (location: Location) => (
    <TouchableOpacity
      key={location.id}
      style={styles.locationCard}
      onPress={() => {
        setSelectedLocation(location);
        setShowBottomSheet(true);
      }}
    >
      <View style={styles.locationCardHeader}>
        <View style={[styles.locationIconContainer, { backgroundColor: `${getLocationColor(location.type)}20` }]}>
          <Ionicons 
            name={getLocationIcon(location.type)} 
            size={24} 
            color={getLocationColor(location.type)} 
          />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>
            {location.name}
          </Text>
          <Text style={styles.locationAddress}>
            {location.address}
          </Text>
          {location.rating && (
            <View style={styles.locationRating}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.locationRatingText}>
                {location.rating}
              </Text>
              <Text style={styles.locationCoordinate}>
                ({location.type === 'tour' ? 'Tour' : 'Địa điểm'})
              </Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  const renderBottomSheet = () => (
    <View
      style={{
        height: showBottomSheet ? height * 0.6 : 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
      }}
    >
      <View style={styles.bottomSheetContent}>
        <View style={styles.bottomSheetHandle} />
        
        <Text style={styles.bottomSheetTitle}>
          {selectedAddress ? selectedAddress.name || 'Địa chỉ đã tìm' : 
           selectedLocation ? selectedLocation.name : 'Địa điểm gần đây'}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedAddress ? (
            <View>
              <View style={styles.selectedAddressHeader}>
                <View style={styles.selectedAddressIcon}>
                  <Ionicons name="location" size={32} color="#3B82F6" />
                </View>
                <View style={styles.selectedAddressInfo}>
                  <Text style={styles.selectedAddressName}>
                    {selectedAddress.name || selectedAddress.formatted_address.split(',')[0]}
                  </Text>
                  <Text style={styles.selectedAddressText}>
                    {selectedAddress.formatted_address}
                  </Text>
                  <View style={styles.coordinateRow}>
                    <Ionicons name="pin" size={16} color="#6B7280" />
                    <Text style={styles.coordinateText}>
                      Tọa độ: {selectedAddress.geometry.location.lat.toFixed(6)}, {selectedAddress.geometry.location.lng.toFixed(6)}
                    </Text>
                  </View>
                  {selectedAddress.rating && (
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={18} color="#F59E0B" />
                      <Text style={styles.ratingText}>
                        {selectedAddress.rating}/5.0
                      </Text>
                    </View>
                  )}
                  
                  {selectedAddress.types && selectedAddress.types.length > 0 && (
                    <View style={styles.typesContainer}>
                      <Text style={styles.typesTitle}>Loại địa điểm:</Text>
                      <View style={styles.typesRow}>
                        {selectedAddress.types.slice(0, 3).map((type, index) => (
                          <View key={index} style={styles.typeTag}>
                            <Text style={styles.typeText}>
                              {type.replace(/_/g, ' ')}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Chỉ đường</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonGreen]}>
                  <Text style={styles.actionButtonText}>Đặt tour</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  setSelectedAddress(null);
                  setSearchQuery('');
                }}
              >
                <Text style={styles.secondaryButtonText}>Tìm địa điểm khác</Text>
              </TouchableOpacity>
            </View>
          ) : selectedLocation ? (
            <View>
              <View style={styles.selectedAddressHeader}>
                <View style={[styles.selectedAddressIcon, { backgroundColor: `${getLocationColor(selectedLocation.type)}20` }]}>
                  <Ionicons 
                    name={getLocationIcon(selectedLocation.type)} 
                    size={32} 
                    color={getLocationColor(selectedLocation.type)} 
                  />
                </View>
                <View style={styles.selectedAddressInfo}>
                  <Text style={styles.selectedAddressName}>
                    {selectedLocation.name}
                  </Text>
                  <Text style={styles.selectedAddressText}>
                    {selectedLocation.address}
                  </Text>
                  {selectedLocation.rating && (
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={18} color="#F59E0B" />
                      <Text style={styles.ratingText}>
                        {selectedLocation.rating}
                      </Text>
                      <Text style={styles.coordinateText}>
                        ({selectedLocation.type === 'tour' ? 'Tour du lịch' : 'Địa điểm tham quan'})
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Chỉ đường</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonGreen]}>
                  <Text style={styles.actionButtonText}>Đặt tour</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setSelectedLocation(null)}
              >
                <Text style={styles.secondaryButtonText}>Xem tất cả địa điểm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {isLoadingNearby ? (
                <View style={styles.loadingContainer}>
                  <View style={{ width: 32, height: 32, borderWidth: 2, borderColor: '#D1D5DB', borderTopColor: '#3B82F6', borderRadius: 16, marginBottom: 16 }} />
                  <Text style={styles.loadingText}>Đang tìm kiếm địa điểm gần đây...</Text>
                </View>
              ) : nearbyLocations.length > 0 ? (
                <>
                  <Text style={styles.nearbyTitle}>
                    Địa điểm gần đây ({nearbyLocations.length})
                  </Text>
                  {nearbyLocations.map(renderLocationCard)}
                </>
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIcon}>
                    <Ionicons name="location-outline" size={32} color="#9CA3AF" />
                  </View>
                  <Text style={styles.emptyText}>
                    Chưa có dữ liệu địa điểm gần đây
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Tap vào nút location để tìm kiếm địa điểm gần đây
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );

  const renderMapControls = () => (
    <View style={styles.mapControls}>
      <View style={styles.mapControlsContainer}>
        {/* Map Style Controls */}
        <TouchableOpacity
          onPress={() => setMapStyle('standard')}
          style={[styles.mapControlButton, mapStyle === 'standard' && { backgroundColor: '#EBF8FF' }]}
        >
          <View style={[styles.mapControlIcon, mapStyle === 'standard' ? styles.mapControlActive : styles.mapControlInactive]}>
            <Ionicons 
              name="map" 
              size={16} 
              color={mapStyle === 'standard' ? 'white' : '#5F6368'} 
            />
          </View>
          <Text style={[styles.mapControlText, mapStyle === 'standard' ? styles.mapControlActiveText : styles.mapControlInactiveText, { fontFamily: 'Roboto' }]}>
            Bản đồ
          </Text>
          {mapStyle === 'standard' && (
            <View style={{ marginLeft: 'auto' }}>
              <Ionicons name="checkmark" size={16} color="#4285F4" />
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setMapStyle('satellite')}
          style={[styles.mapControlButton, mapStyle === 'satellite' && { backgroundColor: '#EBF8FF' }]}
        >
          <View style={[styles.mapControlIcon, mapStyle === 'satellite' ? styles.mapControlActive : styles.mapControlInactive]}>
            <Ionicons 
              name="planet" 
              size={16} 
              color={mapStyle === 'satellite' ? 'white' : '#5F6368'} 
            />
          </View>
          <Text style={[styles.mapControlText, mapStyle === 'satellite' ? styles.mapControlActiveText : styles.mapControlInactiveText, { fontFamily: 'Roboto' }]}>
            Vệ tinh
          </Text>
          {mapStyle === 'satellite' && (
            <View style={{ marginLeft: 'auto' }}>
              <Ionicons name="checkmark" size={16} color="#4285F4" />
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setMapStyle('hybrid')}
          style={[styles.mapControlButton, styles.mapControlButtonLast, mapStyle === 'hybrid' && { backgroundColor: '#EBF8FF' }]}
        >
          <View style={[styles.mapControlIcon, mapStyle === 'hybrid' ? styles.mapControlActive : styles.mapControlInactive]}>
            <Ionicons 
              name="layers" 
              size={16} 
              color={mapStyle === 'hybrid' ? 'white' : '#5F6368'} 
            />
          </View>
          <Text style={[styles.mapControlText, mapStyle === 'hybrid' ? styles.mapControlActiveText : styles.mapControlInactiveText, { fontFamily: 'Roboto' }]}>
            Lai
          </Text>
          {mapStyle === 'hybrid' && (
            <View style={{ marginLeft: 'auto' }}>
              <Ionicons name="checkmark" size={16} color="#4285F4" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderZoomControls = () => (
    <View style={styles.zoomControls}>
      <View style={styles.zoomControlsContainer}>
        <TouchableOpacity
          onPress={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
          style={styles.zoomButton}
        >
          <View style={styles.zoomIcon}>
            <Ionicons name="add" size={16} color="#5F6368" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setZoomLevel(prev => Math.max(prev - 1, 1))}
          style={[styles.zoomButton, styles.zoomButtonLast]}
        >
          <View style={styles.zoomIcon}>
            <Ionicons name="remove" size={16} color="#5F6368" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Map */}
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: generateMapHTML() }}
          style={{ flex: 1 }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={false}
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Search Bar */}
      {renderSearchBar()}

      {/* Map Controls */}
      {renderMapControls()}

      {/* Zoom Controls */}
      {renderZoomControls()}

      {/* Bottom Sheet */}
      {renderBottomSheet()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  bottomSheetContent: {
    padding: 16,
  },
  bottomSheetHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  selectedAddressContainer: {
    marginBottom: 16,
  },
  selectedLocationContainer: {
    marginBottom: 16,
  },
  selectedLocationText: {
    color: '#6B7280',
    marginBottom: 8,
  },
  coordinateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nearbySection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  nearbyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    color: '#6B7280',
    marginLeft: 8,
  },
  nearbyScrollView: {
    maxHeight: 256,
  },
  emptyContainer: {
    paddingVertical: 32,
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  locationCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  locationRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationRatingText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
  },
  locationCoordinate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  selectedAddressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  selectedAddressIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#DBEAFE',
  },
  selectedAddressInfo: {
    flex: 1,
  },
  selectedAddressName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedAddressText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  coordinateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 4,
  },
  typesContainer: {
    marginTop: 12,
  },
  typesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#1E40AF',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  actionButtonGreen: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#F3F4F6',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptySubtext: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
  mapControls: {
    position: 'absolute',
    top: 80,
    right: 16,
    zIndex: 10,
  },
  mapControlsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapControlButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mapControlButtonLast: {
    borderBottomWidth: 0,
  },
  mapControlIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mapControlText: {
    fontWeight: '500',
  },
  mapControlActive: {
    backgroundColor: '#3B82F6',
  },
  mapControlActiveText: {
    color: '#3B82F6',
  },
  mapControlInactive: {
    backgroundColor: '#F3F4F6',
  },
  mapControlInactiveText: {
    color: '#6B7280',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
  zoomControlsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  zoomButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  zoomButtonLast: {
    borderBottomWidth: 0,
  },
  zoomIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mapContainer: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#1f2937',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  searchButton: {
    marginLeft: 8,
    marginRight: 8,
  },
  searchButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResults: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 8,
    maxHeight: 320,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchResultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchResultsHeaderText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  searchResultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  searchResultSubtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Roboto',
  },
  searchResultChevron: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 8,
    padding: 16,
  },
  noResultsText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  searchButtonSecondary: {
    marginTop: 8,
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    marginLeft: 8,
    flex: 1,
  },
});

export default ExploreScreen;
