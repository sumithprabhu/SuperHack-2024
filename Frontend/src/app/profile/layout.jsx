import Header from "@/components/profile/Header";
import Sidebar from "@/components/profile/Sidebar";

const layout = ({ children }) => {
	return (
		<div className="flex justify-start items-center mr-8">
			<Sidebar />
			{/* Profile section */}
			<div className="h-[90vh] ml-4 p-5 w-4/5 border-2 mt-5 rounded-t-2xl bg-gray-600">
				<Header />
				<div className="px-7">{children}</div>
			</div>
		</div>
	);
};

export default layout;
