'use client';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import DojangCard from '@/components/dojang/DojangCard';
import Pageheader from '@/components/layout/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    naver: any;
  }
}

interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  phone: string;
  place_url: string;
  category_name: string;
  x: string;
  y: string;
}

export default function DojangsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dojangs, setDojangs] = useState<KakaoPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [verifiedDojangs, setVerifiedDojangs] = useState<string[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const fetchVerifiedDojangs = async () => {
      const { data } = await supabase.from('도장').select('name');
      if (data) {
        setVerifiedDojangs(data.map((d) => d.name));
      }
    };
    fetchVerifiedDojangs();
  }, []);

  const initMap = () => {
    if (mapRef.current && window.naver) {
      mapInstance.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.978),
        zoom: 12,
      });
      setMapLoaded(true);
    }
  };

  // 이미 로드됐으면 바로 initMap
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initMap();
    }
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  useEffect(() => {
    if (!debouncedSearch.trim()) return;

    const fetchDojangs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${debouncedSearch}&size=15`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_LOCAL_API_KEY}`,
            },
          },
        );
        const data = await res.json();
        setDojangs(data.documents);
        clearMarkers();

        if (data.documents.length > 0 && mapInstance.current) {
          const firstPlace = data.documents[0];
          mapInstance.current.setCenter(
            new window.naver.maps.LatLng(firstPlace.y, firstPlace.x),
          );
          mapInstance.current.setZoom(13);

          data.documents.forEach((place: KakaoPlace) => {
            const marker = new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(place.y, place.x),
              map: mapInstance.current,
              title: place.place_name,
            });
            markersRef.current.push(marker);
          });
        }
      } catch (error) {
        console.error('검색 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDojangs();
  }, [debouncedSearch]);

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={initMap}
      />

      <div className="w-full min-h-screen">
        {/* 헤더 fixed 고정 */}
        <div
          ref={headerRef}
          className="fixed top-0 left-50 right-0 z-10 bg-white shadow-md flex justify-center"
        >
          <div className="w-full max-w-7xl px-6">
            <Pageheader
              title="도장찾기"
              description="전국의 주짓수 도장"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div
          style={{ paddingTop: `${headerHeight + 24}px` }}
          className="pb-6 flex justify-center"
        >
          <div className="w-full max-w-7xl px-6 flex flex-col gap-4">
            {/* 지도 - 상단 */}
            <div className="relative">
              {!mapLoaded && (
                <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-btn-focus rounded-full animate-spin" />
                </div>
              )}
              <div
                ref={mapRef}
                className="w-full h-100 rounded-lg overflow-hidden border border-gray-200"
              />
            </div>

            {/* 카드 리스트 - 하단 2열 */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-btn-focus rounded-full animate-spin" />
              </div>
            ) : dojangs.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {dojangs.map((dojang) => (
                  <DojangCard
                    key={dojang.id}
                    dojang={dojang}
                    isVerified={verifiedDojangs.includes(dojang.place_name)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-lg">검색어를 입력해주세요</p>
                <p className="text-sm mt-2">
                  지역명이나 도장 이름으로 검색해보세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
