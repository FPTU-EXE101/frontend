import type { Pet } from "@/types/pet.type";
import { Heart, QrCode, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calcAge, getPetEmoji } from "./petHelpers";

export interface PetCardProps {
  pet: Pet;
  onViewDetail: (pet: Pet) => void;
  onViewPetCard: (pet: Pet) => void;
}

const PetCard = ({ pet, onViewDetail, onViewPetCard }: PetCardProps) => {
  const emoji = getPetEmoji((pet as any).species);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Avatar banner */}
      <div className="relative h-40 bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 flex items-center justify-center">
        <span className="text-7xl drop-shadow">{emoji}</span>
        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow">
          <Heart className="h-4 w-4 fill-[#D56756] text-[#D56756]" />
        </div>
      </div>

      {/* Info */}
      <div className="px-5 py-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{pet.name}</h3>
          {(pet as any).species && (
            <p className="text-sm text-slate-500">{(pet as any).species}</p>
          )}
        </div>

        <div className="space-y-1.5 text-sm text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Tuổi:</span>
            <span className="font-medium text-slate-800">
              {calcAge(pet.dateOfBirth)}
            </span>
          </div>
          {(pet as any).weight && (
            <div className="flex justify-between">
              <span className="text-slate-400">Cân nặng:</span>
              <span className="font-medium text-slate-800">
                {(pet as any).weight} kg
              </span>
            </div>
          )}
          {pet.color && (
            <div className="flex justify-between">
              <span className="text-slate-400">Màu:</span>
              <span className="font-medium text-slate-800">{pet.color}</span>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="pt-2 flex gap-2">
          <Button
            onClick={() => onViewPetCard(pet)}
            className="flex-1 rounded-full bg-[#172554] text-white text-sm hover:bg-[#1e3a8a] transition"
          >
            <QrCode className="h-4 w-4 mr-1.5" />
            Xem thẻ
          </Button>
          <Button
            onClick={() => onViewDetail(pet)}
            className="flex-1 rounded-full bg-[#D56756] text-white text-sm hover:bg-[#c25248] transition"
          >
            <Newspaper className="h-4 w-4 mr-1.5" />
            Chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
