import React, { useState } from "react";

export default function MultiSelect({ items, onSelectedItem, onDeSelectedItem }) {
    const [dropdown, setDropdown] = useState(false);

    const [selectedItems, setSelected] = useState([]);

    const toogleDropdown = () => {
        setDropdown(!dropdown);
    };

    const addTag = (itemId) => {
        let item = items.find((i) => i.id === itemId);

        if (!selectedItems.includes(item.name)) {
            setSelected(selectedItems.concat(item.name));
            onSelectedItem(item);
            toogleDropdown();
        }
    };

    const removeTag = (e, item) => {
        e.stopPropagation();
        const filtered = selectedItems.filter((e) => e !== item);
        onDeSelectedItem(item);
        setSelected(filtered);
    };

    return (
        <div className="w-full h-full relative">
            <MultiselectWrapper
                selectedItems={selectedItems}
                toogleDropdown={toogleDropdown}
                removeTag={removeTag}
            />
            {dropdown ? <DropdownList list={items} addItem={addTag}></DropdownList> : null}
        </div>
    );
}

const MultiselectWrapper = ({ selectedItems, toogleDropdown, removeTag }) => {
    return (
        <div className="flex flex-col items-center relative">
            <div className="w-full ">
                <div
                    className="my-2 p-1 flex border border-gray-300 rounded "
                    onClick={toogleDropdown}
                >
                    <div className="flex flex-auto flex-wrap">
                        {selectedItems.map((tag, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-teal-700 bg-teal-100 border border-teal-300 "
                                >
                                    <div className="text-xs font-normal leading-none max-w-full flex-initial">
                                        {tag}
                                    </div>
                                    <div className="flex flex-auto flex-row-reverse">
                                        <div onClick={(e) => removeTag(e, tag)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="100%"
                                                height="100%"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {/* <div className="flex-1">
                                            <input
                                                placeholder=""
                                                className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                                            />
                                        </div> */}
                    </div>
                    <div className="text-gray-300 w-8 py-1 pl-1 pr-2 border-l flex items-center justify-center border-gray-200">
                        <button
                            className="cursor-pointer w-4 h-6 text-gray-600 outline-none focus:outline-none"
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-chevron-up w-4 h-4"
                            >
                                <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DropdownList = ({ list, addItem }) => {
    return (
        <div className="absolute shadow top-100 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto ">
            <div className="flex flex-col w-full">
                {list.map((item, key) => {
                    return (
                        <div
                            key={key}
                            className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
                            onClick={() => addItem(item.id)}
                        >
                            <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                                <div className="w-full items-center flex">
                                    <div className="mx-2 leading-6  ">{item.name}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
