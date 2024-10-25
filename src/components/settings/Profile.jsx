import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6'>
				<img
					src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdm0qx8t0i9gc9.cloudfront.net%2Fthumbnails%2Fvideo%2FVd3bj2jPe%2Fvideoblocks-happy-business-woman-closing-laptop-at-workplace-in-slow-motion-close-up-young-woman-finishing-work-on-computer-indoor-relaxed-girl-stretching-arms-after-working-day-in-office-at-evening_bfezo7odu_thumbnail-1080_01.png&f=1&nofb=1&ipt=25d480629948df38de7bba7515cf1036f9116ef7f2e764884ade34a59689b6e1&ipo=images'
					alt='Profile'
					className='rounded-full w-20 h-20 object-cover mr-4'
				/>

				<div>
					<h3 className='text-lg font-semibold text-gray-100'>Shakshi Kumari</h3>
					<p className='text-gray-200'>shakshikumari215@example.com</p>
				</div>
			</div>

			<button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'>
				Edit Profile
			</button>
		</SettingSection>
	);
};
export default Profile;
