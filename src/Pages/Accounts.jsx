import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";

import CreateAccountModal from "../Components/Account_Components/CreateAccountModal.jsx";
import AccountCard from "../Components/Account_Components/AccountCard.jsx";
import AccountFilter from "../Components/Account_Components/AccountFilter.jsx";

import { IoMdAdd } from "react-icons/io";
import { FaAnglesRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";

function AccountsPage() {
  const accounts = useSelector((state) => state.accounts.accounts);

  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    result = result.filter((acc) =>
      activeTab === "active" ? !acc.isArchived : acc.isArchived,
    );

    if (searchQuery.trim() !== "") {
      result = result.filter((acc) =>
        acc.nameLower.includes(searchQuery.toLowerCase().trim()),
      );
    }

    if (sortOption === "nameAsc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "nameDesc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    result.sort((a, b) => b.isPinned - a.isPinned);

    return result;
  }, [accounts, activeTab, searchQuery, sortOption]);

  const activeCount = accounts.filter((acc) => !acc.isArchived).length;
  const archivedCount = accounts.filter((acc) => acc.isArchived).length;
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAccounts.slice(startIndex, endIndex);
  }, [filteredAccounts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortOption]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortOption]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filteredAccounts.length]);
  return (
    <>
      <div className="w-full min-h-full bg-white dark:bg-[#333334] p-5 rounded-b-lg relative">
        <div className="flex gap-3 mb-1 bg-[#E1E3F5] dark:bg-[#3D3D3E] backdrop-blur-[20px] rounded-xl p-2 border border-white/10">
          <button
            className={`flex-1 py-3 px-2 md:px-5  rounded-lg cursor-pointer  flex justify-center items-center ${
              activeTab === "active"
                ? " bg-[#3041DC] dark:bg-[#27272A] font-semibold text-white"
                : "text-white-50 "
            }`}
            onClick={() => setActiveTab("active")}
          >
            Accounts
            <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-[22px] bg-[#A7ACDD] dark:bg-[#828284] text-white text-xs font-medium rounded-lg px-2 shadow-md">
              {activeCount}
            </span>
          </button>

          <button
            className={`flex-1 py-3 px-5 rounded-lg  cursor-pointer flex justify-center items-center ${
              activeTab === "archived"
                ? " bg-[#3041DC] dark:bg-[#27272A]  font-semibold text-white"
                : "text-white-50"
            }`}
            onClick={() => setActiveTab("archived")}
          >
            Archived
            <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-[22px] bg-[#A8AEE1] dark:bg-[#828284] text-white text-xs font-medium rounded-lg px-2 shadow-md">
              {archivedCount}
            </span>
          </button>
        </div>

        <div className="sticky top-0 z-50 m-3 p-1 ">
          <div
            className="flex items-center gap-3 p-3 rounded-xl 
                  bg-white/5 backdrop-blur-3xl 
                  border border-white/10 
                  shadow-lg"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 
                   bg-white dark:bg-[#2D2E32] 
                    text-black dark:text-white placeholder-gray-400 
                   rounded-lg 
                   border border-black/10 
                   focus:outline-none 
                   "
              />
            </div>

            <AccountFilter
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            {searchQuery
              ? "No accounts found."
              : activeTab === "active"
                ? "No accounts created yet."
                : "No archived accounts."}
          </div>
        ) : (
          <div className="space-y-3">
            {/* {filteredAccounts.map((acc) => ( */}
            {paginatedAccounts.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                onEdit={(account) => {
                  setEditingAccount(account);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 rounded-lg  bg-[#E1E3F4] disabled:opacity-50 "
            >
              <FaAnglesLeft color="#A9AEDF" />
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
        <button
          onClick={() => {
            setEditingAccount(null);
            setIsModalOpen(true);
          }}
          className="fixed bottom-30 right-10 md:bottom-6  md:right-6 bg-[#283FE1] dark:bg-[#27272A] text-white  md:w-15 md:h-15 w-13 h-13 rounded-full text-2xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200"
        >
          <IoMdAdd />
        </button>
      </div>

      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingAccount={editingAccount}
      />
    </>
  );
}

export default AccountsPage;
