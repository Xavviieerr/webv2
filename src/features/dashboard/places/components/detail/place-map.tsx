"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface PlaceMapProps {
	latitude: string;
	longitude: string;
	name: string;
}

export function PlaceMap({ latitude, longitude }: PlaceMapProps) {
	const [MapComponent, setMapComponent] = useState<React.ReactNode | null>(null);

	const lat = parseFloat(latitude);
	const lng = parseFloat(longitude);

	useEffect(() => {
		if (typeof window === "undefined" || isNaN(lat) || isNaN(lng)) return;

		let cancelled = false;

		const loadLeaflet = async () => {
			try {
				const existingLink = document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]');
				if (!existingLink) {
					const link = document.createElement("link");
					link.rel = "stylesheet";
					link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
					document.head.appendChild(link);
				}

				const { MapContainer, TileLayer, Marker } = await import("react-leaflet");
				const L = await import("leaflet");

				if (cancelled) return;

				const icon = L.divIcon({
					className: "custom-marker",
					html: '<div style="background:#02474F;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>',
					iconSize: [16, 16],
					iconAnchor: [8, 8],
				});

					setMapComponent(
					<MapContainer
						center={[lat, lng]}
						zoom={13}
						scrollWheelZoom={false}
						style={{ height: "256px", width: "100%", zIndex: 0 }}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[lat, lng]} icon={icon} />
					</MapContainer>,
				);
			} catch {
				// silently fail — map won't render
			}
		};

		loadLeaflet();

		return () => {
			cancelled = true;
		};
	}, [lat, lng]);

	if (isNaN(lat) || isNaN(lng)) {
		return null;
	}

	if (!MapComponent) {
		return (
			<div className="bg-[#D4E8EA] rounded-xl h-64 flex items-center justify-center">
				<div className="flex flex-col items-center gap-2 text-[#8AA5A8]">
					<MapPin className="w-8 h-8" />
					<span className="text-sm">Loading map...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[#D4E8EA] rounded-xl overflow-hidden">
			{MapComponent}
		</div>
	);
}
