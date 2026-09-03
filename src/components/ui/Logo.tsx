import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  type?: 'white' | 'normal';
}

const Logo = ({ type }: LogoProps) => {
  if (type === 'normal') {
    return (
      <Link href={'/'} className="cursor-pointer">
        <Image
          src="/guono-logo.svg"
          alt="guọnọ-logo"
          width={90}
          height={30}
          aria-label="Guọnọ logo"
        />
      </Link>
    )
  }
  return (
    <Link href={'/'} className="cursor-pointer">
      <Image
        src="/gouno-logo-light.svg"
        alt="guọnọ-logo"
        width={100}
        height={40}
        aria-label="Guọnọ logo"
      />
    </Link>
  );
}

export default Logo;
