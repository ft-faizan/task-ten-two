import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteTransaction } from "../../Store/Accounts/accountsSlice.js";
import ConfirmAlert from "../Coman_Components/ConfromAlert.jsx";
import { useToast } from "../../Context/ToastContext.jsx";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";

function TransactionActions({
  transaction,
  accountId,
  onEdit,
}) {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const { showToast } = useToast();
const [showConfirm, setShowConfirm] = useState(false);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleDeleteConfirm = () => {
  dispatch(
    deleteTransaction({
      accountId,
      transactionId: transaction.id,
    })
  );

  showToast("Transaction deleted successfully", "success");
  setShowConfirm(false);
};

const handleDeleteCancel = () => {
  setShowConfirm(false);
};
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();

          const rect = e.currentTarget.getBoundingClientRect();
          const dropdownHeight = 120;
          const dropdownWidth = 140;

          let top = rect.bottom;
          let left = rect.right - dropdownWidth;

          if (rect.bottom + dropdownHeight > window.innerHeight) {
            top = rect.top - dropdownHeight;
          }

          left = Math.max(10, left);

          setMenuPosition({ top, left });
          setOpenMenu(!openMenu);
        }}
        className="text-xl dark:text-white cursor-pointer"
      >
        ⋮
      </button>

      {openMenu && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPosition.top,
            left: menuPosition.left,
          }}
          className="bg-white dark:bg-[#2D2E32]   shadow-md rounded-lg border-gray-200 border dark:border-gray-700 w-36 z-50"
        >
          <button
            onClick={() => {
              onEdit(transaction);
              setOpenMenu(false);
            }}
            className="block w-full text-left px-4 py-2  rounded-xl hover:bg-[#3041DC] hover:text-white  dark:hover:bg-[#5D5D62] cursor-pointer"
          >
          <div className="flex items-center gap-1">
              <MdDriveFileRenameOutline size={20} />
              Edit
            </div>
          </button>

          <button
            
            onClick={(e) => {
  e.stopPropagation();
  setShowConfirm(true);
  setOpenMenu(false);
}}
            className="block w-full text-left px-4 py-2 text-red-500 rounded-xl hover:bg-[#FB313D] hover:text-white  cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <MdDeleteSweep className="text-xl" />
              Delete
            </div>
          </button>
        </div>
      )}
      <ConfirmAlert
  isOpen={showConfirm}
  title="Delete Transaction?"
  message={`Are you sure you want to delete "${transaction.title}"? This action cannot be undone.`}
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={handleDeleteConfirm}
  onCancel={handleDeleteCancel}
/>
    </>
  );
}

export default TransactionActions;
