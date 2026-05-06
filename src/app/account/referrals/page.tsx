import { AccountLayout } from "@/features/account/components/AccountLayout";
import { title } from "process";
import { FaRegCopy } from "react-icons/fa";
import { MdCardGiftcard } from "react-icons/md";

const refCode = "https://preview--nippy-my-account-huref=MFONISOIBOKETTE21REF";

const pointsArray = [
  {
    title: "Friends invited",
    score: "0",
  },
  {
    title: "Successful referrals",
    score: "0",
  },
  {
    title: "Points earned",
    score: "0",
  },
];

const howItWorks = [
  {
    id: 1,
    title: "Share Your Link",
    description:
      "Copy your unique referral link and share it with friends via email or social media.",
  },
  {
    id: 2,
    title: "Friend Signs Up",
    description:
      "Your friend creates an account and makes their first purchase through your shared link.",
  },
  {
    id: 3,
    title: "Both Earn Points",
    description:
      "You and your friend each receive 200 loyalty points to spend on your next orders.",
  },
];

export default function AccountReferralPage() {
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

        {/* Banner */}
        <div className="flex flex-col gap-4 p-6 rounded-lg bg-[#1E2A3A] relative overflow-hidden">
          <p className="text-xl font-semibold flex items-center gap-2 text-white">
            <MdCardGiftcard /> Refer and earn 200 points
          </p>
          <p className="text-xs text-gray-400 lg:w-[70%] z-40">
            Share your unique link with friends. When they sign up and make
            their first purchase, you both earn 200 loyalty points!
          </p>

          <div className="flex flex-col md:flex-row gap-2">
            <p className="bg-white rounded-full flex items-center text-xs md:text-sm p-2">
              {refCode
                ? refCode
                : "Your fereral code appears here once implemented"}
            </p>
            <button className="flex items-center w-fit rounded-full text-sm font-semibold bg-white p-2 cursor-pointer">
              <FaRegCopy /> Copy
            </button>
          </div>

          <div className="bg-[#243447] rounded-full w-20 h-20 md:w-40 md:h-40 hidden md:flex absolute -top-7 -right-7"></div>
        </div>

        {/* Cards grid dey here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pointsArray.map((point) => (
            <div
              key={point.title}
              className="px-6 py-2 border border-border rounded-lg flex flex-col items-center"
            >
              <p
                className={`text-4xl font-bold ${point.title === "Points earned" && "text-primary"}`}
              >
                {point.score}
              </p>
              <p className="font-semibold">{point.title}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-lg shadow-2xl p-2 md:p-4">
          <p className="font-semibold">How it works</p>
          {/* How it works grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {howItWorks.map((item) => (
              <div key={item.id} className="flex flex-col gap-3">
                <p className="flex rounded-full w-10 h-10 bg-primary justify-center items-center text-white ">
                  {item.id}
                </p>

                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-xs">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
