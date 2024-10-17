import { Menu } from "@headlessui/react";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "./Ui/Dropdown";
const actions = [
  {
    name: "Week",
  },
  {
    name: " Month ",
  },
  {
    name: "  Year ",
  },
];
const SelectMonth = () => {
  return (
    <>
      <Dropdown
        classMenuItems=" w-[140px]"
        label={
          <span className="text-lg inline-flex h-6 w-6 flex-col items-center justify-center border bg-white border-slate-200 rounded ">
            <BsThreeDots />
          </span>
        }
      >
        <div>
          {actions.map((item, i) => (
            <Menu.Item key={i}>
              <div
                className="`
                
                  hover:bg-secondary-500 bg-white hover:text-slate-900 text-primary
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center `"
              >
                <span>{item.name}</span>
              </div>
            </Menu.Item>
          ))}
        </div>
      </Dropdown>
    </>
  );
};

export default SelectMonth;
