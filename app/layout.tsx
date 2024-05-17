"use client";
import "./globals.scss";
import { Inter } from "next/font/google";
import { List } from "postcss/lib/list";
import { useContext, createContext, useState } from "react";
import { Course, User } from "./types";
import { useRouter } from "next/navigation";

import IconSearch from "../icons/IconSearch";

const inter = Inter({ subsets: ["latin"] });

export const PageContext = createContext({
  userID: "",
  setUserID: (userID: string) => {},
  userName: "",
  setUserName: (userName: string) => {},
  userList: [],
  setUserList: (userList: User[]) => {},
  courseID: "",
  setCourseID: (courseID: string) => {},
  courseList: [],
  setCourseList: (courseList: Course[]) => {},
  showNoResultsModal: false,
  setShowNoResultsModal: (showNoResultsModal: boolean) => {},
});

export const IndexContext = createContext({
  isLoadingUsers: false,
  setIsLoadingUsers: (isLoadingUsers: boolean) => {},
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [userID, setUserID] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);
  const [courseID, setCourseID] = useState<string>("");
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [showNoResultsModal, setShowNoResultsModal] = useState<boolean>(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <p className="sticky top-0 bg-blue-600 font-bold text-white p-2">
          Course Recommender System
        </p>
        <div className="bg-white-50 flex flex-row min-h-screen">
          <div className="bg-green-100 flex flex-row p-2 w-1/8 min-h-screen">
            <IconSearch />
            <p className="px-4">Search</p>
          </div>

          <PageContext.Provider
            value={{
              userID,
              setUserID,
              userName,
              setUserName,
              userList,
              setUserList,
              courseID,
              setCourseID,
              courseList,
              setCourseList,
              showNoResultsModal,
              setShowNoResultsModal,
            }}
          >
            <IndexContext.Provider
              value={{ isLoadingUsers, setIsLoadingUsers }}
            >
              <div className="flex flex-col w-full">
                <div className="flex justify-end items-center">
                  <button
                    className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700 mx-16 my-4"
                    onClick={() => router.back()}
                  >
                    Back
                  </button>
                </div>
                {children}
              </div>
            </IndexContext.Provider>
          </PageContext.Provider>
        </div>
      </body>
    </html>
  );
}
