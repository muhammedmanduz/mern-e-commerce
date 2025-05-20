import React from "react";
import { useState } from "react";
import { SlBasket } from "react-icons/sl";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const menuItems = [
    { name: "Profil", url: "/profile" },
    { name: "Admin", url: "/admin" },
    { name: "Çıkış", url: "/login" },
  ];
  return (
    <div className="bg-gray-100 h-16 px-5 flex items-center justify-between">
      <div className="text-4xl ">e commerce</div>

      <div className="flex gap-5 items-center">
        <div className="flex items-center">
          <input
            className="outline-none bg-white border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="Arama yap..."
          />
          <div className="p-2 ml-1 bg-white cursor-pointer rounded-md">Ara</div>
        </div>

        <div className="position relative">
          <img
            onClick={() => setOpenMenu(!openMenu)}
            className="w-8 h-8 rounded-full"
            src="user.png"
            alt="User"
          />
          {openMenu && (
            <div className="absolute right-0 mt-4  w-[200] bg-white rounded-md shadow-gray-300 shadow-lg">
              {menuItems.map((item, index) => (
                <div key={index} className=" px-2 py-1 hover:bg-gray-100 p-2">
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <SlBasket className="h-8 w-8 pr-1.5" />
          <div className="absolute -top-3 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            4
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
