import Profile from "./Profile";
import Shop from "./Shop";
import RealApi from "./RealApi";
import HomeHeader from "@/components/home/HomeHeader";

export default function Home() {
  return (
    <div className="w-full">
      {/* Header Section - Client Component for translations */}
      <HomeHeader />

      {/* Interactive Components Section - Client Components */}
      <div className="flex flex-col items-center">
        <div className="py-8 w-full flex justify-center">
          <RealApi />
        </div>
        <div className="py-8 w-full flex justify-center">
          <Profile />
        </div>
        <div className="py-8 w-full flex justify-center">
          <Shop />
        </div>
      </div>
    </div>
  );
}
