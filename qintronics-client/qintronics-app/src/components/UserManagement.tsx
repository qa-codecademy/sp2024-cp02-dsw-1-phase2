import { useState, useEffect, useContext } from "react";
import { Trash2, AlertCircle, X } from "lucide-react";
import axiosInstance from "../common/utils/axios-instance.util";
import { AuthContext } from "../context/auth.context";

interface UserInfo {
  firstName: string;
  lastName: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  userInfo: UserInfo;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Delete User</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{userName}</span>? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Alert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-4">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto focus:outline-none hover:text-red-600"
        >
          <X className="h-5 w-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({ isOpen: false, userId: "", userName: "" });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/users?page=${page}&perPage=${perPage}`
      );
      const fetchedUsers = response.data || [];
      setUsers(fetchedUsers.data);
      setTotalUsers(fetchedUsers.total || 0);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, perPage]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      await fetchUsers();
      setDeleteModal({ isOpen: false, userId: "", userName: "" });
    } catch (err) {
      setError("Failed to delete user. Please try again later.");
      console.error("Error deleting user:", err);
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      await axiosInstance.patch(`/users/${userId}`, { role: newRole });
      await fetchUsers();
    } catch (err) {
      setError("Failed to update user role. Please try again later.");
      console.error("Error updating user role:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-medium text-gray-800">Manage Users</h3>
        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
          className="block w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] focus:border-[#1A3F6B] transition duration-200"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {error && <Alert message={error} onClose={() => setError(null)} />}

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading users...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {user.userInfo.firstName} {user.userInfo.lastName}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleChangeUserRole(user.id, e.target.value)
                      }
                      className="border rounded-md px-3 py-2 text-gray-700 focus:ring focus:ring-gray-300"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Delivery_Person">Delivery Person</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group">
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            userId: user.id,
                            userName: `${user.userInfo.firstName} ${user.userInfo.lastName}`,
                          })
                        }
                        disabled={user.id === loggedInUser?.userId}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        Delete
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">No users found</div>
          )}
        </div>
      )}

      {users.length > 0 && (
        <div className="flex justify-between items-center py-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * perPage >= totalUsers}
            className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, userId: "", userName: "" })
        }
        onConfirm={() => handleDeleteUser(deleteModal.userId)}
        userName={deleteModal.userName}
      />
    </div>
  );
};

export default UserManagement;
