"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import Modal from "react-modal";
import { User } from "./types";
import { PageContext, IndexContext } from "./layout";
import { useContext, createContext, useState } from "react";
import { Suspense } from "react";

import UserTable from "@/components/UserTable";
import DefaultUserTable from "@/components/DefaultUserTable";
import UserSkeletonLoader from "./skeletons/UserSkeletonLoader";

export default function Home() {
  // Sử dụng context từ file layout
  const {
    userID,
    setUserID,
    userName,
    setUserName,
    userList,
    setUserList,
    showNoResultsModal,
    setShowNoResultsModal,
  } = useContext(PageContext);

  const { setIsLoadingUsers } = useContext(IndexContext);

  return (
    <div className="flex flex-col">
      <Modal
        isOpen={showNoResultsModal}
        onRequestClose={() => setShowNoResultsModal(false)}
        contentLabel="Không tìm thấy kết quả"
        className="absolute top-1/2 left-1/2 max-w-md w-full transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-bold mb-2">Thông báo</h2>
          <p>Không tìm thấy kết quả nào.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => setShowNoResultsModal(false)}
          >
            Đóng
          </button>
        </div>
      </Modal>

      <div className="flex flex-row">
        <div className="flex flex-row">
          <div className="flex flex-col px-16 py-4">
            <p>User ID:</p>
            <p>User name:</p>
          </div>
          <div className="flex flex-col px-16 py-4">
            <input
              name="id"
              className="mx-8 border border-gray-800 rounded"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              onFocus={(e) => setUserName("")}
            />
            <input
              name="name"
              className="mx-8 border border-gray-800 rounded"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onFocus={(e) => setUserID("")}
            />
          </div>
        </div>
        <button
          className="bg-red-500 text-black border-2 border-red-700 rounded-lg hover:bg-green-500 my-8"
          onClick={() => setIsLoadingUsers(true)}
        >
          Search
        </button>
      </div>

      <div className="max-h-96 overflow-y-scroll">
        {userID === "" && userName === "" ? (
          <Suspense fallback={<UserSkeletonLoader />}>
            <DefaultUserTable />
          </Suspense>
        ) : (
          <Suspense fallback={<UserSkeletonLoader />}>
            <UserTable />
          </Suspense>
        )}
      </div>
    </div>
  );
}
