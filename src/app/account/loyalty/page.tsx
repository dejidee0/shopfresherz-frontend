import { AccountLayout } from "@/features/account/components/AccountLayout";
import { IoMdTrendingUp } from "react-icons/io";

const totals = {
  totalEarned: 815,
  totalRedeemed: 100,
};

interface PointsModel {
  id: string;
  title: string;
  date: string;
  points: string;
}

const pointArray: PointsModel[] = [
  {
    id: "1",
    title: "Purchase - Order #ORD-2025-001",
    date: "Apr 14, 2026",
    points: "+215",
  },
  {
    id: "2",
    title: "Purchase - Order #ORD-2025-001",
    date: "Apr 14, 2026",
    points: "+370",
  },
  {
    id: "3",
    title: "Purchase - Order #ORD-2025-001",
    date: "Apr 14, 2026",
    points: "+50",
  },
  {
    id: "4",
    title: "Purchase - Order #ORD-2025-001",
    date: "Apr 14, 2026",
    points: "+180",
  },
];

export default function AccountReferralPage() {
  const calculateAvailablePoints = () => {
    return totals.totalEarned - totals.totalRedeemed;
  };
  return (
    <AccountLayout
      breadcrumbItems={[{ label: "Referrals", href: "/account/referrals" }]}
    >
      <div className="flex flex-col gap-6 lg:w-[60%]">
        <div>
          <p className="text-2xl font-semibold">Referral Program</p>
          <p className="text-xs text-gray-500">
            Invite friends and earn rewards
          </p>
        </div>

        {/* Banner na na*/}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-8 rounded-lg bg-[#1E2A3A] relative overflow-hidden">
          <div className="flex gap-2 flex-col">
            <p className="text-5xl font-bold text-white">
              {calculateAvailablePoints()}
            </p>
            <p className="text-sm leading-1 text-gray-400">AVAILABLE POINTS</p>
          </div>
          <div className="flex flex-col items-end gap-2 z-40">
            <p className="text-xs text-gray-400">
              Total Earned:{" "}
              <span className="text-white font-medium">
                {totals.totalEarned}
              </span>{" "}
              Total Redeemed:{" "}
              <span className="text-white font-medium">
                {totals.totalRedeemed}
              </span>
            </p>
            <button className="cursor-pointer p-2 px-4 text-sm backdrop-blur-xs w-fit bg-white/10 rounded-xl text-gray-300">
              Redeem Now
            </button>
          </div>
          <div className="bg-[#243447] rounded-full w-20 h-20 md:w-40 md:h-40 hidden md:flex absolute -top-7 -right-7"></div>
        </div>

        <div className="rounded-lg border border-border flex flex-col gap-3 p-3 pt-5">
          <p className="font-semibold flex gap-2 pl-2 items-center"><IoMdTrendingUp className="text-green-600" /> Points Earned</p>
          {
            pointArray.map((point)=>(
                <div key={point.id} className="flex justify-between items-center border-b p-2 border-border">
                    <div className="flex gap-1 flex-col">
                        <p className="text-sm font-semibold">{point.title}</p>
                        <p className="text-text-muted text-xs">{point.date}</p>
                    </div>

                    <p className="text-green-600 font-bold">{point.points}</p>
                </div>
            ))
          }
        </div>
      </div>
    </AccountLayout>
  );
}
