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
    <div className="flex gap-8 items-center justify-center">
      <Image
        src="/images/undana.png"
        alt="Logo Undana"
        width={size}
        height={size}
        priority
        className="object-contain"
      />
      <Image
        src="/images/logo-kkn.png"
        alt="Logo KKN"
        width={size}
        height={size}
        priority
        className="object-contain"
      />
    </div>
  );
}
