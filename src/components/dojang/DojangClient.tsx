'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import DojangCard from '@/components/dojang/DojangCard';
import Pageheader from '@/components/layout/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import Script from 'next/script';

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

interface DojangClientProps {
  initialVerifiedDojangs: string[];
}

export default function DojangClient({
  initialVerifiedDojangs,
}: DojangClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dojangs, setDojangs] = useState<KakaoPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [noLocationResults, setNoLocationResults] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [selectedDojangId, setSelectedDojangId] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<naver.maps.Map | undefined>(undefined);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const cardRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }, []);

  const displayMarkers = useCallback(
    (places: KakaoPlace[]) => {
      clearMarkers();
      if (places.length > 0 && mapInstance.current) {
        const firstPlace = places[0];
        mapInstance.current.setCenter(
          new window.naver.maps.LatLng(firstPlace.y, firstPlace.x),
        );
        mapInstance.current.setZoom(13);

        places.forEach((place) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(
              Number(place.y),
              Number(place.x),
            ),
            map: mapInstance.current,
            title: place.place_name,
          });

          window.naver.maps.Event.addListener(marker, 'click', () => {
            setSelectedDojangId(place.id);
            const card = cardRefs.current[place.id];
            if (card) {
              window.scrollTo({
                top: card.offsetTop - headerHeight - 24,
                behavior: 'smooth',
              });
            }
          });

          markersRef.current.push(marker);
        });
      }
    },
    [headerHeight, clearMarkers],
  );

  const fetchDojangsByLocation = useCallback(
    async (lat: number, lng: number) => {
      if (searchQuery.trim()) return;

      setIsLoading(true);
      setNoLocationResults(false);
      try {
        const res = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=주짓수&x=${lng}&y=${lat}&radius=5000&size=15`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_LOCAL_API_KEY}`,
            },
          },
        );
        const data = await res.json();
        if (data.documents?.length === 0) {
          setNoLocationResults(true);
        }
        setDojangs(data.documents ?? []);
        setSelectedDojangId(null);
        if (data.documents?.length > 0) {
          displayMarkers(data.documents);
        } else {
          clearMarkers();
        }
      } catch {
        // 위치 기반 검색 실패 시 무시
      } finally {
        setIsLoading(false);
        setIsLocating(false);
      }
    },
    [displayMarkers, clearMarkers, searchQuery],
  );

  const initMap = useCallback(() => {
    if (mapRef.current && window.naver) {
      mapInstance.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.978),
        zoom: 12,
      });
      setMapLoaded(true);
      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapInstance.current?.setCenter(
            new window.naver.maps.LatLng(latitude, longitude),
          );
          fetchDojangsByLocation(latitude, longitude);
        },
        () => {
          setLocationDenied(true);
          setIsLocating(false);
        },
      );
    }
  }, [fetchDojangsByLocation]);

  useEffect(() => {
    if (window.naver && window.naver.maps) initMap();
  }, [initMap]);

  // 검색어 지웠을 때 위치 기반으로 복귀
  useEffect(() => {
    if (debouncedSearch.trim()) return;
    if (locationDenied) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchDojangsByLocation(latitude, longitude);
      },
      () => {},
    );
  }, [debouncedSearch, locationDenied, fetchDojangsByLocation]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return;

    const fetchDojangs = async () => {
      setIsLoading(true);
      setNoLocationResults(false);
      try {
        const res = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${debouncedSearch} 주짓수&size=15`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_LOCAL_API_KEY}`,
            },
          },
        );
        const data = await res.json();
        setDojangs(data.documents ?? []);
        setSelectedDojangId(null);
        if (data.documents?.length > 0) {
          displayMarkers(data.documents);
        } else {
          clearMarkers();
        }
      } catch {
        // 검색 실패 시 무시
      } finally {
        setIsLoading(false);
      }
    };

    fetchDojangs();
  }, [debouncedSearch, displayMarkers, clearMarkers]);

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={initMap}
      />

      <div className="w-full min-h-screen">
        <div
          ref={headerRef}
          className="fixed top-0 left-50 right-0 z-10 bg-bg-white shadow-md flex justify-center"
        >
          <div className="w-full max-w-7xl px-6">
            <Pageheader
              title="도장찾기"
              description="전국의 주짓수 도장"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder={
                isLocating
                  ? '현재 위치를 확인하는 중...'
                  : '도장 이름이나 지역으로 검색...'
              }
            />
          </div>
        </div>

        <main
          style={{ paddingTop: `${headerHeight + 24}px` }}
          className="pb-6 flex justify-center"
          aria-label="도장 찾기"
        >
          <div className="w-full max-w-7xl px-6 flex flex-col gap-4">
            {/* 지도 */}
            <div className="relative">
              {!mapLoaded && (
                <div
                  className="absolute inset-0 bg-btn-basic rounded-lg flex items-center justify-center z-10"
                  role="status"
                  aria-label="지도 불러오는 중"
                >
                  <div
                    className="w-8 h-8 border-4 border-border border-t-btn-focus rounded-full animate-spin"
                    aria-hidden="true"
                  />
                </div>
              )}
              <div
                ref={mapRef}
                className="w-full h-100 rounded-lg overflow-hidden border border-border"
                style={{ zIndex: 0 }}
                role="application"
                aria-label="도장 위치 지도"
              />
            </div>

            {/* 위치 감지 중 로딩 */}
            {isLocating && !searchQuery.trim() && (
              <div
                className="flex items-center justify-center gap-2 py-4 text-text-secondary text-sm"
                aria-live="polite"
              >
                <div className="w-4 h-4 border-2 border-gray-300 border-t-btn-focus rounded-full animate-spin" />
                현재 위치를 확인하는 중입니다...
              </div>
            )}

            {/* 도장 목록 */}
            {isLoading ? (
              <div role="status" aria-label="도장 검색 중">
                <div className="flex items-center justify-center py-20">
                  <div
                    className="w-8 h-8 border-4 border-border border-t-btn-focus rounded-full animate-spin"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ) : dojangs.length > 0 ? (
              <ul
                className="grid grid-cols-2 gap-4"
                aria-label={`검색 결과 ${dojangs.length}개`}
              >
                {dojangs.map((dojang) => (
                  <li
                    key={dojang.id}
                    ref={(el) => {
                      cardRefs.current[dojang.id] = el;
                    }}
                  >
                    <DojangCard
                      dojang={dojang}
                      isVerified={initialVerifiedDojangs.includes(
                        dojang.place_name,
                      )}
                      isSelected={selectedDojangId === dojang.id}
                    />
                  </li>
                ))}
              </ul>
            ) : dojangs.length === 0 && debouncedSearch.trim() ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-text-secondary"
                aria-live="polite"
              >
                <p className="text-lg">검색 결과가 없습니다</p>
                <p className="text-sm mt-2">다른 검색어로 시도해보세요</p>
              </div>
            ) : locationDenied ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-text-secondary"
                aria-live="polite"
              >
                <p className="text-lg">위치 접근이 거부되었습니다</p>
                <p className="text-sm mt-2">
                  검색어를 입력하거나 브라우저 설정에서 위치 권한을 허용해주세요
                </p>
              </div>
            ) : noLocationResults ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-text-secondary"
                aria-live="polite"
              >
                <p className="text-lg">주변 5km 내 도장이 없습니다</p>
                <p className="text-sm mt-2">
                  검색어를 입력해서 다른 지역을 찾아보세요
                </p>
              </div>
            ) : !isLocating ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-text-secondary"
                aria-live="polite"
              >
                <p className="text-lg">검색어를 입력해주세요</p>
                <p className="text-sm mt-2">
                  지역명이나 도장 이름으로 검색해보세요
                </p>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
