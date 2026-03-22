import Image from "next/image";

export default function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="SpikeXlogistics"
        width={40}
        height={40}
        className="h-full w-auto"
        priority
      />
      <span className="flex items-baseline leading-none">
        <span className="font-extrabold text-lg tracking-tight text-blue-700">
          Spike
        </span>
        <span className="font-extrabold text-lg tracking-tight text-gray-900">
          X
        </span>
        <span className="font-medium text-lg tracking-wide text-gray-500 ml-0.5">
          logistics
        </span>
      </span>
    </span>
  );
}
