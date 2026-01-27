import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

interface QRCodeProps {
  url?: string;
  size?: number;
  className?: string;
}

export function QRCode({ url, size = 200, className = '' }: QRCodeProps) {
  const { t } = useTranslation('booking');
  
  // Get the booking page URL
  const getBookingUrl = () => {
    if (url) return url;
    
    // Always use production booking URL for QR codes (so they work when scanned)
    // Default directly to the booking page URL
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;
    if (publicUrl) {
      // If VITE_PUBLIC_URL is set, use it (should include /#booking or we add it)
      return publicUrl.includes('/#booking') ? publicUrl : `${publicUrl}/#booking`;
    }
    // Default to booking page URL
    return 'https://play8.ai/#booking';
  };

  const bookingUrl = getBookingUrl();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCodeSVG
          value={bookingUrl}
          size={size}
          level="M"
          includeMargin={true}
        />
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center max-w-xs">
        {t('qrCode.scanToBook')}
      </p>
    </div>
  );
}

