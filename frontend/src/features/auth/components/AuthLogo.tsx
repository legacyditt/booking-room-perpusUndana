import Image from "next/image";

interface AuthLogoProps {
  /**
   * Ukuran lebar dan tinggi logo dalam piksel.
   * Default: 100
   */
  size?: number;
}

export function AuthLogo({ size = 100 }: AuthLogoProps) {
  return (
    <div className="flex gap-6 sm:gap-8 items-center justify-center">
      <Image
        src="/images/undana.png"
        alt="Logo Undana"
        width={size}
        height={size}
        priority
        className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
      />
      <Image
        src="/images/logo-kkn.png"
        alt="Logo KKN"
        width={size}
        height={size}
        priority
        className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
      />
    </div>
  );
}
