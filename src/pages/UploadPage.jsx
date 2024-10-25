
import Upload from "../components/upload";
import Header from "../components/common/Header";


const SalesPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-[#94A5DB]'>
			{/* <Header title='Insurance Dashboard' style={{ color: 'black' }}/> */}

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<Upload/>
			</main>
		</div>
	);
};
export default SalesPage;
