import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import TransactionModal from "../Components/AccountDetails_Components/TransactionModal.jsx";
import TransactionActions from "../Components/AccountDetails_Components/TransactionActions.jsx";
import AccountDetailsFilter from "../Components/AccountDetails_Components/AccountDetailsFilter.jsx";

import { IoMdAdd } from "react-icons/io";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";
import { HiOutlineArrowNarrowUp } from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";
import { FaAnglesRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";
import { MdAccountBalanceWallet } from "react-icons/md";
import { SiExpensify } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
function AccountDetailsPage() {
  const { id } = useParams();

  const account = useSelector((state) =>
    state.accounts.accounts.find((acc) => acc.id === id),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const [filters, setFilters] = useState({
    search: "",
    dateType: "all",
    month: null,
    customDate: null,
    transactionType: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  if (!account) {
    return <div className="p-6">Account not found</div>;
  }

  const transactions = account.transactions;

  const processedTransactions = [...transactions]

    .filter((t) => t.title.toLowerCase().includes(filters.search.toLowerCase()))

    .filter((t) => {
      if (filters.transactionType === "all") return true;
      return t.type === filters.transactionType;
    })

    .filter((t) => {
      const txDate = new Date(t.date);
      const today = new Date();

      if (filters.dateType === "today") {
        return txDate.toDateString() === today.toDateString();
      }

      if (filters.dateType === "month" && filters.month !== null) {
        return txDate.getMonth() === filters.month;
      }

      if (filters.dateType === "custom" && filters.customDate) {
        return (
          txDate.toDateString() === new Date(filters.customDate).toDateString()
        );
      }

      return true;
    })

    .sort((a, b) => {
      let comparison = 0;

      if (sortConfig.key === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      }

      if (sortConfig.key === "name") {
        comparison = a.title.localeCompare(b.title);
      }

      if (sortConfig.key === "amount") {
        comparison = a.amount - b.amount;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

  const totalIncome = processedTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = processedTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const formatCompact = (amount) =>
    new Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);

  const formatFull = (amount) => new Intl.NumberFormat("en-IN").format(amount);

  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedTransactions.slice(startIndex, endIndex);
  }, [processedTransactions, currentPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [processedTransactions.length]);
  return (
    <div
      className="w-full
         h-full
         bg-white
         dark:bg-[#333334]
         p-1
         md:p-5
         rounded-b-lg 
         flex flex-col
         md:justify-center
         justify-evenly
         items-center
         md:gap-1
         "
    >
      <div className="w-full  ">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div
            className="flex flex-row justify-between items-center
           gap-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-700/40 rounded-2xl p-1 md:px-3 md:py-3 shadow-sm hover:shadow-md transition-shadow duration-200 w-full"
          >
            <div className="w-[50%] h-full relative z-50">
              <div className="flex items-center gap-1.5">
                <div className="bg-green-500/10 dark:bg-green-400/10 p-1.5 rounded-lg">
                  <FaRupeeSign className="text-green-600 dark:text-green-400 text-xs sm:text-sm" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Income
                </p>
              </div>
              <p className="text-green-600 dark:text-green-400 font-bold text-sm sm:text-base md:text-lg leading-tight pl-8 md:pl-11  ">
                <span title={`₹ ${formatFull(totalIncome)}`}>
                  {formatCompact(totalIncome)}
                </span>
              </p>
            </div>
            <div className="w-[50%] h-full flex items-center justify-end text-green-600 dark:text-green-400 text-2xl">
              <GiTakeMyMoney className="text-[#AEE1BF] dark:text-[#42554D] md:text-green-600 md:dark:text-green-400 text-5xl relative z-0" />
            </div>
          </div>

          <div className="flex flex-row  justify-between items-center gap-1 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border border-red-200 dark:border-red-700/40 rounded-2xl p-1 md:px-3 md:py-3  shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-[50%] h-full relative z-50">
              <div className="flex items-center gap-1.5">
                <div className="bg-red-500/10 dark:bg-red-400/10 p-1.5 rounded-lg">
                  <FaRupeeSign className="text-red-600 dark:text-red-400 text-xs sm:text-sm" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Expense
                </p>
              </div>
              <p className="text-red-600 dark:text-red-400 font-bold text-sm sm:text-base md:text-lg leading-tight  pl-8 md:pl-11">
                <span title={`₹ ${formatFull(totalExpense)}`}>
                  {formatCompact(totalExpense)}
                </span>
              </p>
            </div>
            <div className="w-[50%] h-full flex items-center justify-end text-red-600 dark:text-red-400 text-2xl">
              <SiExpensify className=" text-[#FDD0D2] dark:text-[#573133] md:text-red-600 md:dark:text-red-400 text-5xl" />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center gap-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/40 rounded-2xl  p-1 md:px-3 md:py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-[50%] h-full relative z-50">
              <div className="flex items-center gap-1.5">
                <div className="bg-blue-500/10 dark:bg-blue-400/10 p-1.5 rounded-lg">
                  <FaRupeeSign className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Balance
                </p>
              </div>
              <p
                className={`font-bold text-sm sm:text-base md:text-lg leading-tight pl-8 md:pl-11 ${
                  balance > 0
                    ? "text-green-600 dark:text-green-400"
                    : balance < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-blue-600 dark:text-blue-400"
                }`}
              >
                <span title={`₹ ${formatFull(balance)}`}>
                  {formatCompact(balance)}
                </span>
              </p>
            </div>
            <div className="w-[50%] h-full flex items-center justify-end text-blue-600 dark:text-blue-400 text-2xl">
              <MdAccountBalanceWallet className=" text-[#C1D6FE] dark:text-[#323C59] md:text-blue-600 md:dark:text-blue-400 text-5xl" />
            </div>
          </div>
        </div>
      </div>
      <div
        className=" 
       h-auto
        w-full
         sticky
          top-0
          "
      >
        <AccountDetailsFilter
          filters={filters}
          setFilters={setFilters}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
        />
      </div>

      <div className=" w-full h-[10%]  ">
        <table className="w-full h-full  p-1 mt-1 md:mt-0">
          <thead className="bg-[#E1E3F4] dark:bg-[#3D3D3E]  ">
            <tr className=" border-gray-200">
              <th
                onClick={() => handleSort("date")}
                className="w-[25%] px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition rounded-l-lg"
              >
                <div className="flex items-center gap-2">
                  <span>Date</span>
                  {sortConfig.key === "date" && (
                    <span className="text-[#3041DC] dark:text-[#E5E7EB]">
                      {sortConfig.direction === "asc" ? (
                        <HiOutlineArrowNarrowUp className="w-4 h-4" />
                      ) : (
                        <HiOutlineArrowNarrowDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort("name")}
                className="w-[25%] px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition"
              >
                <div className="flex items-center gap-2">
                  <span>Name</span>
                  {sortConfig.key === "name" && (
                    <span className="text-[#3041DC] dark:text-[#E5E7EB]">
                      {sortConfig.direction === "asc" ? (
                        <HiOutlineArrowNarrowUp className="w-4 h-4" />
                      ) : (
                        <HiOutlineArrowNarrowDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort("amount")}
                className="w-[25%] px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition "
              >
                <div className="flex items-center justify-end gap-2">
                  <span className="pl-5">Amount</span>
                  {sortConfig.key === "amount" && (
                    <span className="text-[#3041DC] dark:text-[#E5E7EB]">
                      {sortConfig.direction === "asc" ? (
                        <HiOutlineArrowNarrowUp className="w-4 h-4" />
                      ) : (
                        <HiOutlineArrowNarrowDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>

              <th className="w-[25%] px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition rounded-r-lg   ">
                {" "}
                Action
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div className=" p-2 h-[50vh] md:h-[56vh] w-full flex flex-col ">
        {processedTransactions.length === 0 ? (
          <div className="flex-1 flex justify-center items-center rounded-xl bg-[#E5E7EB]  dark:bg-[#848486] ">
            <p className="text-gray-500 text-sm sm:text-base dark:text-[#27272A]">
              No transactions found.
            </p>
          </div>
        ) : (
          <div className=" rounded-xl shadow-sm  flex flex-col flex-1 overflow-hidden bg-[#E5E7EB]  dark:bg-[#2D2E32]">
            <div className="flex-1 overflow-y-auto hide-scrollbar  ">
              <table className="w-full table-fixed">
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer "
                    >
                      <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm text-gray-500 dark:text-white ">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>

                      <td className="px-3 sm:px-6 py-3">
                        <span
                          title={transaction.title}
                          className="block truncate max-w-[110px] sm:max-w-[220px] text-xs sm:text-sm font-medium text-gray-900  dark:text-white"
                        >
                          {transaction.title}
                        </span>
                      </td>

                      <td className="px-3 sm:px-6 py-3 text-right">
                        <div
                          className={`inline-flex items-center justify-end gap-1 text-xs sm:text-sm font-semibold ${
                            transaction.type === "income"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          <FaRupeeSign className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span title={`₹ ${formatFull(transaction.amount)}`}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCompact(transaction.amount)}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 sm:px-6 py-3 text-right ">
                        <TransactionActions
                          transaction={transaction}
                          accountId={account.id}
                          onEdit={(tx) => {
                            setEditingTransaction(tx);
                            setIsModalOpen(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 rounded-lg  bg-[#E1E3F4] disabled:opacity-50"
            >
              <FaAnglesLeft color="#A9AEDF" />{" "}
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg  ${
                  currentPage === i + 1
                    ? "bg-[#3041DC] text-white dark:bg-[#27272A] "
                    : "bg-[#E1E3F4]  dark:bg-[#3D3D3E] "
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 rounded-lg  bg-[#E1E3F4] disabled:opacity-50"
            >
              <FaAnglesRight color="#A9AEDF " />
            </button>
          </div>
        )}
      </div>



      <button
        onClick={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}
        className="fixed
         bottom-45
          right-8
           md:bottom-25
             md:right-13
              bg-[#283FE1]
               dark:bg-[#27272A]
                text-white 
                 md:w-15 
                 md:h-15
                  w-13 
                  h-13 
                  rounded-full
                   text-2xl
                    shadow-lg
                     flex 
                     items-center 
                     justify-center
                      cursor-pointer
                       hover:scale-110 transition-all duration-200
                       z-40
 "
      >
        <IoMdAdd />
      </button>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountId={account.id}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}

export default AccountDetailsPage;
