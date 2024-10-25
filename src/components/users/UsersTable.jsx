import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const userData = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
	{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
];

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);
	const [editingUser, setEditingUser] = useState(null);
	const [editFormData, setEditFormData] = useState({ name: "", email: "", role: "", status: "" });

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	const handleDelete = (userId) => {
		const updatedUsers = filteredUsers.filter((user) => user.id !== userId);
		setFilteredUsers(updatedUsers);
	};

	const handleEditClick = (user) => {
		setEditingUser(user.id);
		setEditFormData({
			name: user.name,
			email: user.email,
			role: user.role,
			status: user.status,
		});
	};

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleEditSave = () => {
		const updatedUsers = filteredUsers.map((user) =>
			user.id === editingUser ? { ...user, ...editFormData } : user
		);
		setFilteredUsers(updatedUsers);
		setEditingUser(null); // Close the edit form after saving
	};

	return (
		<motion.div
			className='bg-gray-400 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Users</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Email
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Role
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredUsers.map((user) => (
							<motion.tr
								key={user.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.name.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-100'>{user.name}</div>
										</div>
									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.email}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{user.role}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											user.status === "Active"
												? "bg-green-800 text-green-100"
												: "bg-red-800 text-red-100"
										}`}
									>
										{user.status}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{editingUser === user.id ? (
										<div>
											<input
												type="text"
												name="name"
												value={editFormData.name}
												onChange={handleEditChange}
												className="bg-gray-700 text-white rounded-lg pl-2 pr-2 py-1 mb-1"
											/>
											<input
												type="text"
												name="email"
												value={editFormData.email}
												onChange={handleEditChange}
												className="bg-gray-700 text-white rounded-lg pl-2 pr-2 py-1 mb-1"
											/>
											<input
												type="text"
												name="role"
												value={editFormData.role}
												onChange={handleEditChange}
												className="bg-gray-700 text-white rounded-lg pl-2 pr-2 py-1 mb-1"
											/>
											<select
												name="status"
												value={editFormData.status}
												onChange={handleEditChange}
												className="bg-gray-700 text-white rounded-lg pl-2 pr-2 py-1 mb-1"
											>
												<option value="Active">Active</option>
												<option value="Inactive">Inactive</option>
											</select>
											<button
												onClick={handleEditSave}
												className='text-green-400 hover:text-green-300 mr-2'
											>
												Save
											</button>
											<button
												onClick={() => setEditingUser(null)}
												className='text-red-400 hover:text-red-300'
											>
												Cancel
											</button>
										</div>
									) : (
										<>
											<button
												onClick={() => handleEditClick(user)}
												className='text-indigo-400 hover:text-indigo-300 mr-2'
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(user.id)}
												className='text-red-400 hover:text-red-300'
											>
												Delete
											</button>
										</>
									)}
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default UsersTable;
