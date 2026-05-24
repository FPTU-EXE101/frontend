import { useMemo, useRef, useState } from "react";
import { Check, Copy, Download, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";

interface PetQRCodeProps {
  petId: string;
  petName?: string;
}

const getPublicPetCardUrl = (petId: string) => {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/pet-card/${petId}`;
};

const PetQRCode = ({ petId, petName }: PetQRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const petCardUrl = useMemo(() => getPublicPetCardUrl(petId), [petId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(petCardUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    const safeName = (petName || petId).replace(/[^a-z0-9-_]/gi, "-");
    link.download = `${safeName}-pet-card-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
          <QrCode className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-semibold text-slate-950">QR Code</h3>
          <p className="text-xs text-slate-500">
            Quét để mở Digital Pet Card public
          </p>
        </div>
      </div>

      <div className="flex justify-center rounded-2xl bg-slate-50 p-4">
        <QRCodeCanvas
          ref={canvasRef}
          value={petCardUrl}
          size={208}
          bgColor="#ffffff"
          fgColor="#0f172a"
          includeMargin
          level="M"
        />
      </div>

      <p className="mt-3 break-all rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
        {petCardUrl}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? "Đã copy" : "Copy link"}
        </Button>
        <Button
          type="button"
          className="rounded-full bg-[#D56756] text-white hover:bg-[#c25248]"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
      </div>
    </section>
  );
};

export default PetQRCode;
