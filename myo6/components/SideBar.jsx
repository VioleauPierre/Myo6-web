import Link from "next/link";

export default function SideBar({ setISideBarOpen }) {
    return (
        <div className="fixed top-0 left-0 h-full bg-gray-900 min-w-[230px] z-10">
            <div className="p-2">
                <button className="text-lg p-1 font-light text-white" onClick={() => setISideBarOpen(false)}>
                    Menu
                </button>

                <div className="justify-center items-center justify-items-center text-white text-[12px]">
                    <Link
                        className="shadow-md hover:shadow-xl transition ease-in-out duration-500 rounded bg-bleuclair py-2 px-4 my-3 w-full flex justify-start items-center justify-items-start"
                        href="/dataExports"
                    >
                        <div>
                            <img src="/assets/icons/documentation.svg" alt="Exports CSV" className="w-4 h-4 mr-1" />
                        </div>
                        Exports CSV
                    </Link>
                </div>
            </div>
        </div>
    );
}
