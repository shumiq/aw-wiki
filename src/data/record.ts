import { TankClassName } from "~/data/class_type";
import ClassesJSON from "~/data/classes.json";
import { NationName } from "~/data/nation_type";
import NationsJSON from "~/data/nations.json";
import { TankName } from "~/data/tank_type";
import TankJSON from "~/data/tanks.json";
import TankDataJSON from "~/data/tank_data.json";

const tankData = Object.values(TankJSON).filter((t) => typeof t === "object");

const tankDetailData = TankDataJSON as Record<string, any>;

export const TankRecord = Object.fromEntries(
  tankData.map((t) => [t.tank_key, { ...t, data: tankDetailData[t.tank_key] }]),
) as Record<
  TankName,
  {
    tank_key: TankName;
    title: string;
    dealer: string;
    nation: NationName;
    vehicle_class: TankClassName;
    damageMax: string;
    PremiumPurchasePrice: string;
    damage?: string;
    rate?: string;
    salvoReloadTime: string;
    ArmorPenFactor?: string;
    Tier: string;
    id: string;
    nation_icon: string;
    vehicle_class_icon: string;
    data: {
      key: string;
      name: string;
      info: string;
      img: string;
      basic: {
        gun: string;
        penetration: number;
        damage: number;
        dpm: number;
        reload: number;
        topSpeed: number;
        acc0to32: number;
        camo: number;
        viewRange: number;
        hp: number;
        armor: {
          hull: {
            front: number;
            side: number;
            rear: number;
          };
          turret: {
            front: number;
            side: number;
            rear: number;
          };
        };
      };
      detail: {
        guns: Array<{
          name: string;
          shells: Array<{
            name: string;
            type: string;
            speed: number;
            penetration: number;
            damage: number;
          }>;
        }>;
        armors: Array<{
          name: string;
          hull: {
            front: number;
            side: number;
            rear: number;
          };
          turret: {
            front: number;
            side: number;
            rear: number;
          };
        }>;
        equipments: Array<string>;
        smoke: Array<string>;
      };
    };
  }
>;

export const TankClassRecord = ClassesJSON as Record<TankClassName, string>;

export const NationRecord = NationsJSON as Record<NationName, string>;
