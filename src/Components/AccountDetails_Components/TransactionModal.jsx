import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addTransaction,
  editTransaction,
} from "../../Store/Accounts/accountsSlice";
import DateTimePicker from "./DateTimePicker";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "../../Context/ToastContext.jsx";
function TransactionModal({ isOpen, onClose, accountId, editingTransaction }) {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const { showToast } = useToast();
  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setDate(new Date(editingTransaction.date));
    } else {
      setTitle("");
      setAmount("");
      setType("income");
      setDate(new Date());
    }
  }, [editingTransaction]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim() || !amount || !date) {
      showToast("All fields are required", "error");
      return;
    }

    const formattedDate = date.toISOString();

    if (editingTransaction) {
      dispatch(
        editTransaction({
          accountId,
          transactionId: editingTransaction.id,
          updatedData: {
            title: title.trim(),
            amount: Number(amount),
            type,
            date: formattedDate,
          },
        }),
      );

      showToast("Transaction updated successfully", "success");
    } else {
      dispatch(
        addTransaction(accountId, {
          title: title.trim(),
          amount: Number(amount),
          type,
          date: formattedDate,
        }),
      );

      showToast("Transaction added successfully", "success");
    }

    setTitle("");
    setAmount("");
    setType("income");
    setDate(new Date());

    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 transition-all duration-300 animate-in fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-[#27272A]  w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
       

        <div className="flex items-center justify-between p-6 bg-[#3041DC]  dark:bg-[#27272A]">
          <div className="flex items-center  gap-2.5">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                type === "income" ? "bg-emerald-400 scale-110" : "bg-red-400 scale-110"
              }`}
            />
            <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white tracking-tight">
              {editingTransaction ? "Edit Transaction" : "New Transaction"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all hover:scale-110 active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4 pb-8 sm:pb-6 dark:bg-[#2D2E32]  ">
          <div className="flex flex-col gap-1.5 group">
            <label className="text-xs font-semibold text-gray-400">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none select-none">
                {/* $ */}
              </span>
              <input
                type="number"
                placeholder="Rupees"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200
                 dark:border-gray-700
                bg-gray-50
                 dark:bg-[#27272A]
                text-sm
                 text-gray-900
                  dark:text-gray-300
                 placeholder-gray-400
                 dark:placeholder-white/50  
                  outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 group">
            <label className="text-xs font-semibold text-gray-400">
              Transaction Name
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200
                 dark:border-gray-700
                bg-gray-50
                 dark:bg-[#27272A]
                text-sm
                 text-gray-900
                  dark:text-gray-300
                 placeholder-gray-400
                 dark:placeholder-white/50  
                  outline-none "
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Date & Time
            </label>
            <div className="flex flex-wrap gap-2 [&_button]:transition-all [&_button]:duration-200">
              <DateTimePicker value={date} onChange={setDate} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-[#27272A] rounded-xl">
              <button
                onClick={() => setType("income")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  type === "income"
                    ? "bg-white dark:bg-black text-emerald-600 shadow-md ring-1 ring-emerald-200 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <TrendingUp
                  size={15}
                  className={type === "income" ? "animate-pulse" : ""}
                />
                Income
              </button>
              <button
                onClick={() => setType("expense")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  type === "expense"
                    ? "bg-white dark:bg-black text-red-500 shadow-md ring-1 ring-red-200 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <TrendingDown
                  size={15}
                  className={type === "expense" ? "animate-pulse" : ""}
                />
                Expense
              </button>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -mx-6" />

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all hover:scale-[1.02] active:scale-95 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#27272A]/50    dark:hover:border-gray-600"
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-[#283FE1] text-sm font-semibold text-white hover:bg-[#283FE1]/90 transition-all hover:scale-[1.02] active:scale-95 dark:bg-[#27272A]  dark:text-gray-300 dark:hover:bg-[#27272A]/90 border border-gray-700">
              {editingTransaction ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
