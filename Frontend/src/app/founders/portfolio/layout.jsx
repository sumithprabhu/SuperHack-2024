import FounderHeader from "@/components/founder_profile/FounderHeader";
import FounderSidebar from "@/components/founder_profile/FounderSidebar";

const layout = ({ children }) => {
	return (
		<div className="flex justify-start items-center mr-8">
			<FounderSidebar />
			<div className="h-[90vh] ml-4 p-5 w-4/5 border-2 mt-5 rounded-t-2xl bg-gray-600 overflow-y-auto">
				<FounderHeader />
				<div className="px-7">{children}</div>
			</div>
		</div>
	);
};

export default layout;